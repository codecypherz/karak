import { removeRandom } from "src/app/util/arrays";
import { Tile } from "./tile";
import { TileType } from "./tiletype";

export class TileBag {

  private tiles = new Array<Tile>();

  constructor() {
    for (let i = 0; i < 20; i++) {
      this.tiles.push(new Tile(TileType.ROOM));
    }
  }

  isEmpty(): boolean {
    return this.tiles.length == 0;
  }

  drawTile(): Tile {
    return removeRandom(this.tiles);
  }

  getNumTiles(): number {
    return this.tiles.length;
  }
}
