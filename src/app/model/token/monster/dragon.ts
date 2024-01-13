import { Monster } from "./monster";

export class Dragon extends Monster {

  constructor() {
    super("dragon.jpg", 15);
  }

  override getTreasureReward(): number {
    return 1.5;
  }
}
