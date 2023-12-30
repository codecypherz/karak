import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import { shuffle } from '../util/arrays';
import { Dungeon } from './dungeon';
import { Cell } from './cell';
import { TileBag } from './tile/tilebag';
import { StarterTile } from './tile/starter_tile';
import { Direction } from './direction';
import { Position } from './position';

export class Game extends EventTarget {

  static START_TURN_EVENT = 'start_turn';

  private id = uuidv4();
  private players = new Array<Player>();
  private dungeon = new Dungeon();
  private tileBag = new TileBag();
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

  getPlayersInOrder(): Array<Player> {
    let inOrderPlayers = new Array<Player>();
    let index = this.activePlayerIndex;
    for (let i = 0; i < this.players.length; i++) {
      inOrderPlayers.push(this.players[index]);
      index = (index + 1) % this.players.length;
    }
    return inOrderPlayers;
  }

  getActivePlayer(): Player {
    let player = this.players[this.activePlayerIndex];
    return player;
  }

  startNextTurn(): void {
    if (!this.canEndTurn()) {
      throw new Error('Cannot end turn right now.');
    }
    this.getActivePlayer().endTurn();
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    this.getActivePlayer().startTurn();
    this.updatePlayerActionIndicators();
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  canEndTurn(): boolean {
    return this.cellBeingConfirmed == null;
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

    // Put the players on the starting tile.
    this.players.forEach(player => {
      player.setPosition(starterCell.getPosition());
    })

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

  private updatePlayerActionIndicators(): void {
    const activePlayer = this.getActivePlayer();
    this.dungeon.forEachCell(cell => {
      cell.setExplorable(false);
      cell.setMoveable(false);
    });

    if (activePlayer.getActionsRemaining() == 0
      || this.cellBeingConfirmed != null) {
      return;
    }

    // Mark immediately adjacent, connected cells as explorable.
    const playerCell = this.dungeon.getCell(activePlayer.getPosition());
    this.dungeon.getConnectedCells(playerCell).forEach(connectedCell => {
      if (connectedCell.isEmpty()) {
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

  moveTo(cell: Cell): void {
    const activePlayer = this.getActivePlayer();
    activePlayer.setPosition(cell.getPosition());
    activePlayer.consumeAction();
    this.updatePlayerActionIndicators();
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
    activePlayer.setPosition(cell.getPosition());
    cell.setConfirmingExplore(false);
    this.cellBeingConfirmed = null;
  
    // After successfully placing a tile, we might need to expand the grid.
    const expandDir = this.dungeon.maybeExpandGrid();
    if (expandDir == Direction.UP) {
      this.players.forEach(player => {
        const pos = player.getPosition();
        player.setPosition(new Position(pos.row + 1, pos.col));
      });
    } else if (expandDir == Direction.LEFT) {
      this.players.forEach(player => {
        const pos = player.getPosition();
        player.setPosition(new Position(pos.row, pos.col + 1));
      });
    }

    this.updatePlayerActionIndicators();
  }

  isGameOver(): boolean {
    // TODO
    return false;
  }
}
