import { Position } from "./position";
import { Tile } from "./tile/tile";

export class Cell {
 
  private tile?: Tile;

  constructor(private pos: Position) {
  }

  setTile(tile?: Tile): void {
    this.tile = tile;
  }

  isEmpty(): boolean {
    return this.tile == null;
  }

  getPosition(): Position {
    return this.pos;
  }
}
