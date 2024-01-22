import { Sound } from "src/app/util/sound";
import { Weapon } from "./weapon";

export class Daggers extends Weapon {

  constructor() {
    super("daggers.jpg", 1);
  }

  override revealed(): void {
    Sound.DAGGER_REVEAL.play();
  }

  override pickedUp(): void {
    Sound.DAGGER_REVEAL.play();
  }
}
