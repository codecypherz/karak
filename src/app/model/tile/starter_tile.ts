import { Tile } from "./tile";
import { TileType } from "./tiletype";

export class StarterTile extends Tile {

  constructor() {
    super(TileType.STARTER, "starter.jpg");
  }
}
