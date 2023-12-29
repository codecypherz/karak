import { TileType } from "./tiletype";

export class Tile {
 
  private type: TileType;

  constructor(type: TileType) {
    this.type = type;
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
}
