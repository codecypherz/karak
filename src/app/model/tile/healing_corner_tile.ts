import { Direction } from "../direction";
import { Tile } from "./tile";

export class HealingCornerTile extends Tile {

  constructor() {
    const pathDirections = new Set<Direction>();

    //
    // =======
    //      ||
    //      ||
    //
    pathDirections.add(Direction.LEFT);
    pathDirections.add(Direction.DOWN);
    super("healing_corner.jpg", pathDirections);
  }

  override healsOnEndOfTurn(): boolean {
    return true;
  }
}