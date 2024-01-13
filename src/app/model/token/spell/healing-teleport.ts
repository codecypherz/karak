import { Player } from "../../player";
import { Spell } from "./spell";

export class HealingTeleport extends Spell {

  constructor() {
    super("healing_teleport.jpg");
  }

  override canCast(): boolean {
    return true;
  }

  override startCasting(player: Player): void {
    player.startCastingHealingTeleport(this);
  }
}
