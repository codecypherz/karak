import { Direction } from "../direction";

export class Tile {
 
  static IMAGE_PATH = "/images/tile/";

  private pathDirections: Set<Direction>;
  readonly imageUrl: string;
  private rotation = Direction.UP;

  constructor(imageUrl: string, pathDirections: Set<Direction>) {
    this.imageUrl = Tile.IMAGE_PATH + imageUrl;
    this.pathDirections = pathDirections;
  }

  revealsToken(): boolean {
    return false;
  }

  healsOnEndOfTurn(): boolean {
    return false;
  }

  getRotation(): Direction {
    return this.rotation;
  }

  rotateClockwise(): void {
    this.rotation = this.rotation.clockwise90();
    const newDirections = new Set<Direction>();
    this.pathDirections.forEach(direction => {
      newDirections.add(direction.clockwise90());
    });
    this.pathDirections = newDirections;
  }

  rotateCounterClockwise(): void {
    this.rotation = this.rotation.counterClockwise90();
    const newDirections = new Set<Direction>();
    this.pathDirections.forEach(direction => {
      newDirections.add(direction.counterClockwise90());
    });
    this.pathDirections = newDirections;
  }

  getPathDirections(): Set<Direction> {
    return this.pathDirections;
  }
}
