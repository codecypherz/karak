import { Monster } from "./monster";
import { Token } from "./token";
import { BattleAxe } from "./battle-axe";

export class SkeletonKing extends Monster {

  constructor() {
    super("skeleton_king.jpg", 10);
  }

  getReward(): Token {
    return new BattleAxe();
  }
}
