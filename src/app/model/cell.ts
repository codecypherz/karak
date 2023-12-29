import { Position } from "./position";
import { Tile } from "./tile/tile";

export class Cell {
 
  private tile: Tile | null = null;

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
}
