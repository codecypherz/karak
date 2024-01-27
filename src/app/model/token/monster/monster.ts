import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Token } from "../token";

export abstract class Monster extends Token {

  private name: string;
  private strength: number;

  constructor(name: string, imageUrl: string, strength: number) {
    super(imageUrl);
    this.name = name;
    this.strength = strength;
  }

  getName(): string {
    return this.name;
  }

  getStrength(): number {
    return this.strength;
  }

  startCombat() {
  }

  handleDefeat(player: Player, cell: Cell): void {
  }
}
