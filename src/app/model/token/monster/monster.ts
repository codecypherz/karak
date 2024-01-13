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

  getTreasureReward(): number {
    return 0;
  }

  getTokenReward(): Token | null {
    return null;
  }
}
