import { Cell } from "./cell";
import { Direction } from "./direction";
import { Position } from "./position";
import { Tile } from "./tile/tile";

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

  setTile(cell: Cell, tile: Tile): void {
    cell.setTile(tile);

    this.getConnectedCells(cell).forEach(connectedCell => {
      if (connectedCell.isEmpty()) {
        connectedCell.setExplorable(true);
      }
    });
  }

  private getConnectedCells(cell: Cell): Set<Cell> {
    const cells = new Set<Cell>();
    if (cell.isEmpty()) {
      return cells;
    }

    const tile = cell.getTile()!;
    tile.getPathDirections().forEach(pathDirection => {
      const cellInDirection = this.getCellInDirection(cell, pathDirection);
      if (cellInDirection != null) {
        cells.add(cellInDirection);
      } else {
        // TODO: Grow the grid.
      }
    })

    return cells;
  }

  private getCellInDirection(cell: Cell, direction: Direction): Cell | null {
    const cellPos = cell.getPosition();
    let row = null;
    let col = null;
    
    switch (direction) {
      case Direction.UP:
        row = cellPos.row - 1;
        col = cellPos.col;
        break;
      case Direction.DOWN:
        row = cellPos.row + 1;
        col = cellPos.col;
        break;
      case Direction.LEFT:
        row = cellPos.row;
        col = cellPos.col - 1;
        break;
      case Direction.RIGHT:
        row = cellPos.row;
        col = cellPos.col + 1;
        break;
    }

    if (row < 0 || row > Dungeon.SIZE - 1
      || col < 0 || col > Dungeon.SIZE - 1) {
      return null;
    }

    return this.cells[row][col];
  }
}
