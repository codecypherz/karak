import { Direction } from "../direction";
import { Tile } from "./tile";

export enum TunnelType {
  THREE_WAY,
  TWO_WAY,
  CORNER
}

export class TunnelTile extends Tile {

  constructor(tunnelType: TunnelType) {
    const pathDirections = new Set<Direction>();

    switch (tunnelType) {
      case TunnelType.THREE_WAY:
        //
        //      ||
        //      ||
        // =============
        //
        pathDirections.add(Direction.UP);
        pathDirections.add(Direction.LEFT);
        pathDirections.add(Direction.RIGHT);
        super("tunnel_3_way.jpg", pathDirections);
        break;
      case TunnelType.TWO_WAY:
        //
        // =============
        //
        pathDirections.add(Direction.LEFT);
        pathDirections.add(Direction.RIGHT);
        super("tunnel_2_way.jpg", pathDirections);
        break;
      case TunnelType.CORNER:
        //
        //      ========
        //      ||
        //      ||
        //
        pathDirections.add(Direction.DOWN);
        pathDirections.add(Direction.RIGHT);
        super("tunnel_corner.jpg", pathDirections);
        break;
    }
  }
}
