import { Cell } from "./cell";
import { Position } from "./position";

export class Dungeon {

  static readonly SIZE = 10;
  private cells: Cell[][];

  constructor() {
    this.cells = new Array<Array<Cell>>();
    for (let row = 0; row < Dungeon.SIZE; row++) {
      let rowArr: Cell[] = new Array<Cell>();
      for (let col = 0; col < Dungeon.SIZE; col++) {
        rowArr.push(new Cell(new Position(row, col)));
      }
      this.cells.push(rowArr);
    }
  }

  getCells(): Cell[][] {
    return this.cells;
  }

  getCenterCell(): Cell {
    let center = Dungeon.SIZE / 2;
    return this.cells[center][center];
  }
}
