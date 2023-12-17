import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import { shuffle } from '../util/arrays';

export class Game extends EventTarget {

  static START_TURN_EVENT = 'start_turn';

  private id = uuidv4();
  private players = new Array<Player>();
  private started = false;
  private activePlayerIndex = 0;

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
    if (!this.started) {
      throw new Error("No active player until started.");
    }
    return this.players[this.activePlayerIndex];
  }

  startNextTurn(): void {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  isStarted(): boolean {
    return this.started;
  }

  start(): void {
    if (this.players.length < 2) {
      throw new Error("Not enough players to start the game.");
    }
    // Shuffle the player order randomly.
    shuffle(this.players);
    this.started = true;
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  isGameOver(): boolean {
    // TODO
    return false;
  }
}
