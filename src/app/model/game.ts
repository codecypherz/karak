import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import { shuffle } from '../util/arrays';
import { Dungeon } from './dungeon';

export class Game extends EventTarget {

  static START_TURN_EVENT = 'start_turn';

  private id = uuidv4();
  private players = new Array<Player>();
  private dungeon = new Dungeon();
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
    this.getActivePlayer().setActive(false);
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    this.getActivePlayer().setActive(true);
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  isStarted(): boolean {
    return this.started;
  }

  getDungeon(): Dungeon {
    return this.dungeon;
  }

  start(): void {
    if (this.players.length < 2) {
      throw new Error("Not enough players to start the game.");
    } else if (this.players.length > 5) {
      throw new Error("Too many players.");
    }
    // Shuffle the player order randomly.
    shuffle(this.players);
    this.activePlayerIndex = 0;
    this.getActivePlayer().setActive(true);
    this.started = true;
    this.dispatchEvent(new Event(Game.START_TURN_EVENT));
  }

  isGameOver(): boolean {
    // TODO
    return false;
  }
}
