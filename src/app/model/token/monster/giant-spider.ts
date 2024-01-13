import { Monster } from "./monster";
import { Daggers } from "../weapon/daggers";
import { Token } from "../token";
import { HealingTeleport } from "../spell/healing-teleport";

export class GiantSpider extends Monster {

  constructor() {
    super("giant_spider.jpg", 5);
  }

  override getTokenReward(): Token | null {
    return new HealingTeleport();
  }
}
