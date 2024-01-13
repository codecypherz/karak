import { v4 as uuidv4 } from 'uuid';
import { CombatConfirmedEvent, CombatResult, ExplorationFinishedEvent, Player } from './player';
import { shuffle } from '../util/arrays';
import { Dungeon } from './dungeon';
import { Cell } from './cell';
import { TileBag } from './tile/tilebag';
import { StarterTile } from './tile/starter_tile';
import { Direction } from './direction';
import { Position } from './position';
import { TokenBag } from './token/tokenbag';
import { Monster } from './token/monster/monster';
import { Dragon } from './token/monster/dragon';

export class Game extends EventTarget {

  static START_TURN_EVENT = 'start_turn';

  private id = uuidv4();
  private players = new Array<Player>();
  private dungeon = new Dungeon();
  private tileBag = new TileBag();
  private tokenBag = new TokenBag();
  private started = false;
  private activePlayerIndex = 0;
  private gameOver = false;

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

  getActivePlayerCell(): Cell {
    return this.dungeon.getCell(this.getActivePlayer().getPosition());
  }

  canEndTurn(): boolean {
    return this.getActivePlayer().canEndTurn();
  }

  endTurn(): void {
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

  isStarted(): boolean {
    return this.started;
  }

  getDungeon(): Dungeon {
    return this.dungeon;
  }

  getTileBag(): TileBag {
    return this.tileBag;
  }

  getTokenBag(): TokenBag {
    return this.tokenBag;
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
        Player.MOVE_EVENT,
        this.onMove.bind(this));
      player.addEventListener(
        Player.COMBAT_CONFIRMED_EVENT,
        this.onCombatConfirmed.bind(this));
      player.addEventListener(
        Player.EXPLORATION_STARTED_EVENT,
        this.onExplorationStarted.bind(this));
      player.addEventListener(
        Player.EXPLORATION_FINISHED_EVENT,
        this.onExplorationFinished.bind(this));
      player.addEventListener(
        Player.TREASURE_OPENED_EVENT,
        this.onTreasureOpened.bind(this));
      player.addEventListener(
        Player.SWAPPING_STARTED_EVENT,
        this.onSwappingStarted.bind(this));
      player.addEventListener(
        Player.SWAPPING_CANCELED_EVENT,
        this.onSwappingCanceled.bind(this));
      player.addEventListener(
        Player.SWAP_CONFIRMED_EVENT,
        this.onSwapConfirmed.bind(this));
      player.addEventListener(
        Player.PICKED_UP_EVENT,
        this.onPickUp.bind(this));
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

  isGameOver(): boolean {
    return this.gameOver;
  }

  getWinningPlayers(): Array<Player> {
    if (!this.isGameOver()) {
      throw new Error('Game is not over');
    }

    let bestScore = 0;
    this.players.forEach(player => {
      if (player.getTreasure() > bestScore) {
        bestScore = player.getTreasure();
      }
    });

    return this.players.filter(player => {
      return player.getTreasure() == bestScore;
    });
  }

  private onMove(e: Event): void {
    this.updatePlayerActionIndicators();
    if (!this.canActivePlayerTakeAnyAction()) {
      this.endTurn();
    }
  }

  private onExplorationStarted(e: Event): void {
    this.updatePlayerActionIndicators();
  }

  private onExplorationFinished(e: Event): void {
    const event = e as ExplorationFinishedEvent;
    const cell = event.cell;

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

    this.updatePlayerActionIndicators();
    if (!this.canActivePlayerTakeAnyAction()) {
      this.endTurn();
    }
  }

  private onSwappingStarted(e: Event): void {
    this.updatePlayerActionIndicators();
  }

  private onSwappingCanceled(e: Event): void {
    this.updatePlayerActionIndicators();
  }

  private onSwapConfirmed(e: Event): void {
    this.endTurn();
  }

  private onPickUp(e: Event): void {
    this.endTurn();
  }

  private onTreasureOpened(e: Event): void {
    this.endTurn();
  }

  private onCombatConfirmed(e: Event): void {
    const event = e as CombatConfirmedEvent;
    const monster = event.monster;
    const combatResult = event.combatResult;

    if (combatResult == CombatResult.WIN
        && monster instanceof Dragon) {
      this.gameOver = true;
    }

    this.updatePlayerActionIndicators();
    if (!this.canActivePlayerTakeAnyAction()) {
      this.endTurn();
    }
  }

  private canActivePlayerTakeAnyAction(): boolean {
    return this.getActivePlayer().canPerformAnAction(this.dungeon);
  }

  private updatePlayerActionIndicators(): void {
    const activePlayer = this.getActivePlayer();
    const activeCell = this.getActivePlayerCell();
    this.dungeon.forEachCell(cell => {
      activePlayer.setActionIndicators(cell, activeCell, this.dungeon, this.tileBag);
    });
  }
}
