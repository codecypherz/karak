import { Monster } from "./monster";
import { Daggers } from "../weapon/daggers";
import { Token } from "../token";

export class GiantRat extends Monster {

  constructor() {
    super("giant_rat.jpg", 5);
  }

  override getTokenReward(): Token | null {
    return new Daggers();
  }
}
