import { v4 as uuidv4 } from 'uuid';
import { CombatConfirmedEvent, CombatResult, Player } from './player';
import { shuffle } from '../util/arrays';
import { Dungeon } from './dungeon';
import { Cell } from './cell';
import { TileBag } from './tile/tilebag';
import { StarterTile } from './tile/starter_tile';
import { Direction } from './direction';
import { Position } from './position';
import { TokenBag } from './token/tokenbag';
import { Monster } from './token/monster/monster';
import { Weapon } from './token/weapon/weapon';

export class Game extends EventTarget {

  static START_TURN_EVENT = 'start_turn';

  private id = uuidv4();
  private players = new Array<Player>();
  private dungeon = new Dungeon();
  private tileBag = new TileBag();
  private tokenBag = new TokenBag();
  private started = false;
  private activePlayerIndex = 0;
  private cellBeingConfirmed: Cell | null = null;

  getId(): string {
    return this.id;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getPlayers(): Array<Player> {
    return this.players;
  }

  getActivePlayer(): Player {
    let player = this.players[this.activePlayerIndex];
    return player;
  }

  getActivePlayerCell(): Cell {
    return this.dungeon.getCell(this.getActivePlayer().getPosition());
  }

  getTilesRemaining(): number {
    return this.tileBag.getNumTiles();
  }

  getTokensRemaining(): number {
    return this.tokenBag.getNumTokens();
  }

  startNextTurn(): void {
    if (!this.canEndTurn()) {
      throw new Error('Cannot end turn right now.');
    }

    // End the currently active player's turn.
    const oldActivePlayer = this.getActivePlayer();
    const oldActiveCell = this.getActivePlayerCell();
    oldActivePlayer.endTurn(oldActiveCell);

    // Make the next player active.
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    this.getActivePlayer().startTurn();
    this.updatePlayerActionIndicators();
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  canEndTurn(): boolean {
    return this.cellBeingConfirmed == null && !this.getActivePlayer().isInCombat();
  }

  isStarted(): boolean {
    return this.started;
  }

  getDungeon(): Dungeon {
    return this.dungeon;
  }

  isValidToStart(): boolean {
    if (this.players.length < 2 || this.players.length > 5) {
      return false;
    }
    return true;
  }

  start(): void {
    if (!this.isValidToStart()) {
      throw new Error('The game is not in a valid starting state.');
    }

    // Set the starting tile.
    const starterCell = this.dungeon.getCenterCell();
    starterCell.setTile(new StarterTile());

    // Initialize players
    this.players.forEach(player => {
      player.addEventListener(
          Player.COMBAT_CONFIRMED_EVENT,
          this.onCombatConfirmed.bind(this));
      player.setPositions(starterCell.getPosition(), starterCell.getPosition());
    }, this);

    // Shuffle the player order randomly.
    shuffle(this.players);
    this.activePlayerIndex = 0;

    // Mark the game as started prior to dispatching events.
    this.started = true;

    // Start the first player's turn.
    this.getActivePlayer().startTurn();
    this.updatePlayerActionIndicators();
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  moveTo(cell: Cell): void {
    const activePlayer = this.getActivePlayer();
    activePlayer.moveTo(cell.getPosition());
    activePlayer.consumeAction();

    if (cell.hasToken()) {
      const token = cell.getToken()!;
      if (token instanceof Monster) {
        activePlayer.startCombat(token);
      }
    }

    this.updatePlayerActionIndicators();
  }

  pickUp(cell: Cell): void {
    if (!cell.hasToken()) {
      throw new Error('Cell had nothing to pick up');
    }
    const token = cell.getToken()!;
    const activePlayer = this.getActivePlayer();
    
    if (token instanceof Weapon && activePlayer.hasTwoWeapons()) {
      activePlayer.setSwappingWeapons(true);
    } else {
      activePlayer.pickUp(token);
      cell.removeToken();
      activePlayer.setActionsRemaining(0);
      this.startNextTurn();
    }

    this.updatePlayerActionIndicators();
  }

  cancelSwap(): void {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer.isSwappingWeapons()) {
      throw new Error('Active player was not swapping weapons.');
    }
    activePlayer.setSwappingWeapons(false);
    this.updatePlayerActionIndicators();
  }

  confirmSwap(): void {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer.isSwappingWeapons()) {
      throw new Error('Active player was not swapping weapons.');
    }

    const activeCell = this.getActivePlayerCell();
    if (!activeCell.hasToken()) {
      throw new Error('Cell had nothing to pick up');
    }
    const tokenToPickUp = activeCell.getToken()!;

    const discardedToken = activePlayer.confirmSwap(tokenToPickUp);
    activeCell.replaceToken(discardedToken);
    activePlayer.setActionsRemaining(0);
    this.startNextTurn();
  }

  explore(cell: Cell): void {
    const activePlayer = this.getActivePlayer();
    if (this.cellBeingConfirmed != null) {
      throw new Error('Another cell is currently being explored.');
    }
    if (!activePlayer.hasActionsRemaining()) {
      throw new Error('Player cannot explore without remaining actions.');
    }
    if (!cell.isExplorable()) {
      throw new Error('Cannot explore an unexplorable tile.');
    }
    if (cell.hasTile()) {
      throw new Error('Cell has already been explored.');
    }

    cell.setTile(this.tileBag.drawTile());
    cell.setConfirmingExplore(true);
    this.cellBeingConfirmed = cell;
    activePlayer.consumeAction();
    this.updatePlayerActionIndicators();
  }

  canConfirmExplore(cell: Cell): boolean {
    const activePlayer = this.getActivePlayer();
    if (this.cellBeingConfirmed == null) {
      return false;
    }
    if (cell != this.cellBeingConfirmed) {
      return false;
    }
    if (cell.getPosition().equals(activePlayer.getPosition())) {
      throw new Error('Player and cell positions should be different.');
    }

    // The current player position needs to be linked to the cell.
    let connectedCells = this.dungeon.getConnectedCells(cell);
    for (let connectedCell of connectedCells) {
      if (connectedCell.getPosition().equals(activePlayer.getPosition())) {
        return true;
      }
    }

    // No link found, so invalid rotation.
    return false;
  }

  confirmExplore(cell: Cell): void {
    if (!this.canConfirmExplore(cell)) {
      throw new Error('Cannot confirm explore.');
    }

    const activePlayer = this.getActivePlayer();
    activePlayer.moveTo(cell.getPosition());
    cell.setConfirmingExplore(false);
    this.cellBeingConfirmed = null;
  
    // After successfully placing a tile, we might need to expand the grid.
    const expandDir = this.dungeon.maybeExpandGrid();
    if (expandDir == Direction.UP) {
      this.players.forEach(player => {
        const pos = player.getPosition();
        const lastPos = player.getLastPosition();
        player.setPositions(
            new Position(pos.row + 1, pos.col),
            new Position(lastPos.row + 1, lastPos.col));
      });
    } else if (expandDir == Direction.LEFT) {
      this.players.forEach(player => {
        const pos = player.getPosition();
        const lastPos = player.getLastPosition();
        player.setPositions(
            new Position(pos.row, pos.col + 1),
            new Position(lastPos.row, lastPos.col + 1));
      });
    }

    // If a room was explored, reveal a token.
    const tile = cell.getTile()!;
    if (tile.revealsToken() && !this.tokenBag.isEmpty()) {
      const token = this.tokenBag.drawToken();
      cell.setToken(token);

      if (token instanceof Monster) {
        this.getActivePlayer().startCombat(token);
      }
    }

    this.updatePlayerActionIndicators();
  }

  isGameOver(): boolean {
    // TODO
    return false;
  }

  private onCombatConfirmed(e: Event): void {
    const event = e as CombatConfirmedEvent;
    const combatResult = event.combatResult;
    const activePlayer = this.getActivePlayer();
    const activeCell = this.getActivePlayerCell();
    const monsterToken = activeCell.getToken();
    if (!(monsterToken instanceof Monster)) {
      throw new Error('Unexpected combat confirmation on non-monster token.');
    }

    switch (combatResult) {
      case CombatResult.WIN:
        // Place the reward in the cell.
        activeCell.replaceToken(monsterToken.getReward());
        break;
      case CombatResult.LOSS:
        activePlayer.reduceHitPoints();
        activePlayer.moveToLastPosition();
        break;
      case CombatResult.TIE:
        activePlayer.moveToLastPosition();
        break;
    }

    this.updatePlayerActionIndicators();
  }

  private updatePlayerActionIndicators(): void {
    const activePlayer = this.getActivePlayer();
    const activeCell = this.getActivePlayerCell();
    this.dungeon.forEachCell(cell => {
      cell.setExplorable(false);
      cell.setMoveable(false);
      cell.setPickupItem(false);
    });

    if (this.cellBeingConfirmed != null
      || activePlayer.isInCombat()) {
      return;
    }
    
    if (activeCell.hasToken() && !activePlayer.isSwappingWeapons()) {
      const token = activeCell.getToken()!;
      activeCell.setPickupItem(activePlayer.canPickUp(token));
    }

    if (activePlayer.getActionsRemaining() == 0) {
      return;
    }

    // Mark immediately adjacent, connected cells as explorable.
    const playerCell = this.getActivePlayerCell();
    this.dungeon.getConnectedCells(playerCell).forEach(connectedCell => {
      if (connectedCell.isEmpty() && !this.tileBag.isEmpty()) {
        connectedCell.setExplorable(true);
      } else {
        // The connected cell has a tile, but the target tile must also
        // contain the player cell in *it's* connected set for it to make
        // a viable movement path.
        const targetConnectedCells = this.dungeon.getConnectedCells(connectedCell);
        let foundPath = false;
        for (let targetConnectedCell of targetConnectedCells) {
          if (targetConnectedCell.getPosition().equals(playerCell.getPosition())) {
            foundPath = true;
            break;
          }
        }
        connectedCell.setMoveable(foundPath);
      }
    });
  }
}
