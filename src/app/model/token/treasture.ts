import { Sound } from "src/app/util/sound";
import { Token } from "./token";

export class Treasure extends Token {

  constructor() {
    super("treasure_closed.jpg");
  }

  override revealed(): void {
    Sound.TREASURE_REVEAL.play();
  }

  override pickedUp(): void {
    Sound.TREASURE_OPEN.play();
  }
}
