import { Position } from "./position";
import { Tile } from "./tile/tile";

export class Cell {
 
  private tile: Tile | null = null;
  private explorable = false;
  private confirmingExplore = false;

  constructor(private pos: Position) {
  }

  getTile(): Tile | null {
    return this.tile;
  }

  setTile(tile: Tile): void {
    if (this.tile != null) {
      throw new Error('Cell already had a tile.');
    }
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

  setExplorable(explorable: boolean): void {
    this.explorable = explorable;
  }

  isExplorable(): boolean {
    return this.explorable;
  }

  setConfirmingExplore(confirmingExplore: boolean): void {
    this.confirmingExplore = confirmingExplore;
  }

  isConfirmingExplore(): boolean {
    return this.confirmingExplore;
  }
}
