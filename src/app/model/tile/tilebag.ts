import { removeRandom } from "src/app/util/arrays";
import { Tile } from "./tile";
import { RoomTile, RoomType } from "./room_tile";

export class TileBag {

  private tiles = new Array<Tile>();

  constructor() {

    // Official numbers
    // ===========================

    // Base Game (80 tiles):
    //
    // 1  Healing 4-way Starter
    // 21 4-way Room
    // 13 3-way Room
    // 13 2-way Room
    // 13 Corner Room
    // 2  Healing Corner Tunnel
    // 4  Teleport 2-way Tunnel
    // 5  3-way Tunnel
    // 4  2-way Tunnel
    // 4  Corner Tunnel
    //

    // Regent Expansion (18 tiles):
    //
    // 4 Cursed Hallway
    // 6 Battle Arena
    // 2 4-way Room
    // 4 3-way Room
    // 2 2-way Room
    //

    // A general rule if customizing tile/token proportions:
    // *Rooms* must always exceed tokens in the token bag.

    for (let i = 0; i < 21; i++) {
      this.tiles.push(new RoomTile(RoomType.FOUR_WAY));
    }
    for (let i = 0; i < 13; i++) {
      this.tiles.push(new RoomTile(RoomType.THREE_WAY));
    }
    for (let i = 0; i < 13; i++) {
      this.tiles.push(new RoomTile(RoomType.TWO_WAY));
    }
    for (let i = 0; i < 13; i++) {
      this.tiles.push(new RoomTile(RoomType.CORNER));
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
