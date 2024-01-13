import { Player } from "../../player";
import { Item } from "../item";

export class Spell extends Item {

  constructor(imageUrl: string) {
    super(imageUrl);
  }

  getStrength(): number {
    return 0;
  }

  canCast(): boolean {
    return false;
  }

  startCasting(player: Player) {
    throw new Error('This spell does not cast');
  }
}
