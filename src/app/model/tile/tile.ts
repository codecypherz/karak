import { Direction } from "../direction";
import { TileType } from "./tiletype";

export class Tile {
 
  static IMAGE_PATH = "/images/tile/";

  private type: TileType;
  private pathDirections = new Set<Direction>();
  readonly imageUrl: string;

  constructor(type: TileType, imageUrl: string) {
    this.type = type;
    this.imageUrl = Tile.IMAGE_PATH + imageUrl;

    // TODO: This is temporary.
    this.pathDirections.add(Direction.UP);
    this.pathDirections.add(Direction.DOWN);
    this.pathDirections.add(Direction.LEFT);
    this.pathDirections.add(Direction.RIGHT);
  }

  getType(): TileType {
    return this.type;
  }

  getTypeText(): string {
    switch (this.type) {
      case TileType.STARTER:
        return 'Starter';
      case TileType.TUNNEL:
        return 'Tunnel';
      case TileType.ROOM:
        return 'Room';
      case TileType.TELEPORTATION:
        return 'Teleportation';
      case TileType.HEALING:
        return 'Healing';
    }
  }

  getPathDirections(): Set<Direction> {
    return this.pathDirections;
  }
}
