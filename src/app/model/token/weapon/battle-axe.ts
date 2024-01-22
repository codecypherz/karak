import { Sound } from "src/app/util/sound";
import { Weapon } from "./weapon";

export class BattleAxe extends Weapon {

  constructor() {
    super("battle_axe.jpg", 3);
  }

  override revealed(): void {
    Sound.AXE_REVEAL.play();
  }

  override pickedUp(): void {
    Sound.AXE_REVEAL.play();
  }
}
