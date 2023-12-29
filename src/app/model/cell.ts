import { Tile } from "./tile/tile";

export class Cell {
 
  private tile?: Tile;

  setTile(tile?: Tile): void {
    this.tile = tile;
  }
}
