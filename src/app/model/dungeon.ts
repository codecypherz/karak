import { Cell } from "./cell";
import { Direction } from "./direction";
import { Position } from "./position";

export class Dungeon {

  private cells: Cell[][];

  constructor() {
    this.cells = new Array<Array<Cell>>();
    for (let row = 0; row < 7; row++) {
      this.cells.push(this.createNewRow(row, 7));
    }
  }

  private getNumRows(): number {
    return this.cells.length;
  }

  private getNumCols(): number {
    return this.cells[0].length;
  }

  getRows(): Cell[][] {
    return this.cells;
  }

  forEachCell(fn: (cell: Cell) => void) {
    this.cells.forEach(row => {
      row.forEach(fn);
    });
  }

  getCell(pos: Position): Cell {
    if (pos.row < 0 || pos.row > this.getNumRows() - 1
      || pos.col < 0 || pos.col > this.getNumCols() - 1) {
      throw new Error('Position out of bounds: ' + pos.toString());
    }
    return this.cells[pos.row][pos.col];
  }

  getCenterCell(): Cell {
    let row = Math.floor(this.getNumRows() / 2);
    let col = Math.floor(this.getNumCols() / 2);
    return this.cells[row][col];
  }

  getConnectedCells(cell: Cell): Set<Cell> {
    const cells = new Set<Cell>();
    if (cell.isEmpty()) {
      return cells;
    }

    const tile = cell.getTile()!;
    tile.getPathDirections().forEach(pathDirection => {
      const cellInDirection = this.getCellInDirection(cell, pathDirection);
      if (cellInDirection != null) {
        cells.add(cellInDirection);
      }
    })

    return cells;
  }

  maybeExpandGrid(): Direction | null {
    const triggerBuffer = 2;

    // Maybe expand downward
    const lastRow = this.cells[this.getNumRows() - triggerBuffer];
    for (let cell of lastRow) {
      if (cell.hasTile()) {
        this.expandDown();
        return Direction.DOWN;
      }
    }
    
    // Maybe expand to the right
    const lastCol = this.getNumCols() - triggerBuffer;
    for (let row of this.cells) {
      const lastCell = row[lastCol];
      if (lastCell.hasTile()) {
        this.expandRight();
        return Direction.RIGHT;
      }
    }

    // Maybe expand upward
    const firstRow = this.cells[triggerBuffer - 1];
    for (let cell of firstRow) {
      if (cell.hasTile()) {
        this.expandUp();
        return Direction.UP;
      }
    }

    // Maybe expand left
    const firstCol = triggerBuffer - 1;
    for (let row of this.cells) {
      const firstCell = row[firstCol];
      if (firstCell.hasTile()) {
        this.expandLeft();
        return Direction.LEFT;
      }
    }

    // No expansion.
    return null;
  }

  private expandDown(): void {
    const newRowIndex = this.getNumRows();
    const newRow = this.createNewRow(newRowIndex, this.getNumCols());
    this.cells.push(newRow);
  }

  private expandRight(): void {
    const newColIndex = this.getNumCols();
    for (let row = 0; row < this.getNumRows(); row++) {
      const rowArr = this.cells[row];
      rowArr.push(new Cell(new Position(row, newColIndex)));
    }
  }

  private expandUp(): void {
    // Add 1 to all row values since we are about to shift the grid.
    this.forEachCell(cell => {
      const pos = cell.getPosition();
      cell.setPosition(pos.row + 1, pos.col);
    });

    const newRowIndex = 0;
    const newRow = this.createNewRow(newRowIndex, this.getNumCols());
    this.cells.splice(newRowIndex, 0, newRow);
  }

  private expandLeft(): void {
    // Add 1 to all col values since we are about to shift the grid.
    this.forEachCell(cell => {
      const pos = cell.getPosition();
      cell.setPosition(pos.row, pos.col + 1);
    });

    const newColIndex = 0;
    for (let row = 0; row < this.getNumRows(); row++) {
      const rowArr = this.cells[row];
      const newCell = new Cell(new Position(row, newColIndex));
      rowArr.splice(newColIndex, 0, newCell);
    }
  }

  private createNewRow(rowIndex: number, numCols: number): Array<Cell> {
    let newRow: Cell[] = new Array<Cell>();
    for (let col = 0; col < numCols; col++) {
      newRow.push(new Cell(new Position(rowIndex, col)));
    }
    return newRow;
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

    if (row == null || col == null
      || row < 0 || row > this.getNumRows() - 1
      || col < 0 || col > this.getNumCols() - 1) {
      return null;
    }

    return this.cells[row][col];
  }
}
