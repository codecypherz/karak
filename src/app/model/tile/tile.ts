
export enum TileType {
  STARTER,
  TUNNEL,
  ROOM,
  TELEPORTATION,
  HEALING
}

export class Tile {
 
  readonly type: TileType;

  constructor(type: TileType) {
    this.type = type;
  }
}
