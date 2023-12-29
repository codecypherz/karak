import { Cell } from "./cell";
import { Tile, TileType } from "./tile/tile";

export class Dungeon {

  static readonly SIZE = 20;
  private cells: Cell[][];

  constructor() {
    this.cells = new Array<Array<Cell>>();
    for (let row = 0; row < Dungeon.SIZE; row++) {
      let rowArr: Cell[] = new Array<Cell>();
      for (let col = 0; col < Dungeon.SIZE; col++) {
        rowArr.push(new Cell());
      }
      this.cells.push(rowArr);
    }

    let center = Dungeon.SIZE / 2;
    let centerCell = this.cells[center][center]
    centerCell.setTile(new Tile(TileType.STARTER));
  }

  getCells(): Cell[][] {
    return this.cells;
  }
}
