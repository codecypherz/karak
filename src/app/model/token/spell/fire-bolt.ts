import { Spell } from "./spell";

export class FireBolt extends Spell {

  constructor() {
    super("fire_bolt.jpg");
  }

  override canBeUsedInCombat(): boolean {
    return true;
  }
  
  override getStrength(): number {
    return 1;
  }
}
