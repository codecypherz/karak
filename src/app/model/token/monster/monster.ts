import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Token } from "../token";

export abstract class Monster extends Token {

  private strength: number;

  constructor(imageUrl: string, strength: number) {
    super(imageUrl);
    this.strength = strength;
  }

  getStrength(): number {
    return this.strength;
  }

  handleDefeat(player: Player, cell: Cell): void {
  }
}
