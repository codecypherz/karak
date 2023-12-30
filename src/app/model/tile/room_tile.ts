import { Direction } from "../direction";
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
    const pathDirections = new Set<Direction>();

    switch (roomType) {
      case RoomType.FOUR_WAY:
        //
        //      ||
        //      ||
        // =============
        //      ||
        //      ||
        //
        pathDirections.add(Direction.UP);
        pathDirections.add(Direction.DOWN);
        pathDirections.add(Direction.LEFT);
        pathDirections.add(Direction.RIGHT);
        super(TileType.ROOM, "room_4_way.jpg", pathDirections);
        break;
      case RoomType.THREE_WAY:
        //
        // =============
        //      ||
        //      ||
        //
        pathDirections.add(Direction.DOWN);
        pathDirections.add(Direction.LEFT);
        pathDirections.add(Direction.RIGHT);
        super(TileType.ROOM, "room_3_way.jpg", pathDirections);
        break;
      case RoomType.TWO_WAY:
        //
        // =============
        //
        pathDirections.add(Direction.LEFT);
        pathDirections.add(Direction.RIGHT);
        super(TileType.ROOM, "room_2_way.jpg", pathDirections);
        break;
      case RoomType.CORNER:
        //
        //      ||
        //      ||
        //      ========
        //
        pathDirections.add(Direction.UP);
        pathDirections.add(Direction.RIGHT);
        super(TileType.ROOM, "room_corner.jpg", pathDirections);
        break;
    }
  }
}
