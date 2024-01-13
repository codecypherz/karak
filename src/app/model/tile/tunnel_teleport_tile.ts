import { Direction } from "../direction";
import { Tile } from "./tile";

export class TunnelTeleportTile extends Tile {

  constructor() {
    const pathDirections = new Set<Direction>();

    //
    //      ||
    //      ||
    //      ||
    //      ||
    //      ||
    //
    pathDirections.add(Direction.UP);
    pathDirections.add(Direction.DOWN);
    super("tunnel_teleport.jpg", pathDirections);
  }
}
