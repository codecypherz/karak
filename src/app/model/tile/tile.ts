import { Direction } from "../direction";
import { TileType } from "./tiletype";

export class Tile {
 
  static IMAGE_PATH = "/images/tile/";

  private type: TileType;
  private pathDirections: Set<Direction>;
  readonly imageUrl: string;
  private rotation = Direction.UP;

  constructor(type: TileType, imageUrl: string, pathDirections: Set<Direction>) {
    this.type = type;
    this.imageUrl = Tile.IMAGE_PATH + imageUrl;
    this.pathDirections = pathDirections;
  }

  getType(): TileType {
    return this.type;
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
