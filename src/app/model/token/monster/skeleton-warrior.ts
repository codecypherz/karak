import { Monster } from "./monster";
import { Token } from "../token";
import { Sword } from "../weapon/sword";

export class SkeletonWarrior extends Monster {

  constructor() {
    super("skeleton_warrior.jpg", 9);
  }

  override getTokenReward(): Token | null {
    return new Sword();
  }
}
