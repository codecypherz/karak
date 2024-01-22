import { Sound } from "src/app/util/sound";
import { Weapon } from "./weapon";

export class Sword extends Weapon {

  constructor() {
    super("sword.jpg", 2);
  }

  override revealed(): void {
    Sound.SWORD_REVEAL.play();
  }

  override pickedUp(): void {
    Sound.SWORD_REVEAL.play();
  }
}
