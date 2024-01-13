import { Player } from "../../player";
import { Item } from "../item";

export class Spell extends Item {

  private selected = false;

  constructor(imageUrl: string) {
    super(imageUrl);
  }

  isSelected(): boolean {
    return this.selected;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
  }
  
  canBeUsedInCombat(): boolean {
    return false;
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
