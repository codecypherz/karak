import { Item } from "../item";

export class Weapon extends Item {

  private strength: number;

  constructor(imageUrl: string, strength: number) {
    super(imageUrl);
    this.strength = strength;
  }

  getStrength(): number {
    return this.strength;
  }
}
