import { Direction } from "../direction";
import { Tile } from "./tile";
import { TileType } from "./tiletype";

export class StarterTile extends Tile {

  constructor() {
    const pathDirections = new Set<Direction>();
    pathDirections.add(Direction.UP);
    pathDirections.add(Direction.DOWN);
    pathDirections.add(Direction.LEFT);
    pathDirections.add(Direction.RIGHT);

    super(TileType.STARTER, "starter.jpg", pathDirections);
  }
}
