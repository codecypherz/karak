import { Monster } from "./monster";

export class Fallen extends Monster {

  constructor() {
    super("fallen.jpg", 12);
  }

  override getTreasureReward(): number {
    return 1;
  }
}
