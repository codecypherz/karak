import { removeRandom } from "src/app/util/arrays";
import { Tile } from "./tile";
import { RoomTile, RoomType } from "./room_tile";

export class TileBag {

  private tiles = new Array<Tile>();

  constructor() {
    for (let i = 0; i < 20; i++) {
      this.tiles.push(new RoomTile(RoomType.THREE_WAY));
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
