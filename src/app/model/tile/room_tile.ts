import { Tile } from "./tile";
import { TileType } from "./tiletype";

export enum RoomType {
  FOUR_WAY,
  THREE_WAY,
  TWO_WAY,
  CORNER
}

export class RoomTile extends Tile {

  constructor(roomType: RoomType) {
    switch (roomType) {
      case RoomType.FOUR_WAY:
        super(TileType.ROOM, "room_4_way.jpg");
        break;
      case RoomType.THREE_WAY:
        super(TileType.ROOM, "room_3_way.jpg");
        break;
      case RoomType.TWO_WAY:
        super(TileType.ROOM, "room_2_way.jpg");
        break;
      case RoomType.CORNER:
        super(TileType.ROOM, "room_corner.jpg");
        break;
    }
  }
}