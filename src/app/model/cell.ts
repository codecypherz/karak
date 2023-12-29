import { Player } from "./player";
import { Position } from "./position";
import { Tile } from "./tile/tile";

export class Cell {
 
  private tile: Tile | null = null;
  private players = new Set<Player>();

  constructor(private pos: Position) {
  }

  getTile(): Tile | null {
    return this.tile;
  }

  setTile(tile: Tile): void {
    this.tile = tile;
  }

  isEmpty(): boolean {
    return this.tile == null;
  }

  hasTile(): boolean {
    return this.tile != null;
  }

  getPosition(): Position {
    return this.pos;
  }

  addPlayer(player: Player): void {
    if (this.players.has(player)) {
      throw new Error('Attempting to add player already present.');
    }
    this.players.add(player);
  }

  removePlayer(player: Player): void {
    if (!this.players.has(player)) {
      throw new Error('Attemption to remove a player not present.');
    }
    this.players.delete(player);
  }

  getPlayers(): Set<Player> {
    return this.players;
  }
}
