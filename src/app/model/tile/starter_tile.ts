import { Direction } from "../direction";
import { Tile } from "./tile";

export class StarterTile extends Tile {

  constructor() {
    const pathDirections = new Set<Direction>();
    pathDirections.add(Direction.UP);
    pathDirections.add(Direction.DOWN);
    pathDirections.add(Direction.LEFT);
    pathDirections.add(Direction.RIGHT);

    super("starter.jpg", pathDirections);
  }

  override heals(): boolean {
    return true;
  }
}
