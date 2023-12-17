import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import { shuffle } from '../util/arrays';

export class Game extends EventTarget {

  private id = uuidv4();
  private players = new Array<Player>();

  getId(): string {
    return this.id;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getPlayers(): Array<Player> {
    return this.players;
  }

  start(): void {
    // Shuffle the player order randomly.
    shuffle(this.players);
  }

  isGameOver(): boolean {
    // TODO
    return false;
  }
}
