import { Item } from "../item";

export class Spell extends Item {

  constructor(imageUrl: string) {
    super(imageUrl);
  }

  getStrength(): number {
    return 0;
  }
}
