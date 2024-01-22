import { Sound } from "src/app/util/sound";
import { Item } from "./item";

export class SkeletonKey extends Item {

  constructor() {
    super("skeleton_key.jpg");
  }

  override revealed(): void {
    Sound.KEY_REVEAL.play();
  }

  override pickedUp(): void {
    Sound.KEY_REVEAL.play();
  }
}
