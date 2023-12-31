
export class Position {
  readonly row: number;
  readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  static from(row: number, col: number): Position {
    return new Position(row, col);
  }

  equals(other: Position | null | undefined): boolean {
    if (!other) {
      return false;
    }
    return this.row == other.row && this.col == other.col;
  }

  toString(): string {
    return '(' + this.row + ',' + this.col + ')';
  }
}
