import { Monster } from "./monster";
import { Token } from "../token";
import { SkeletonKey } from "../skeleton-key";

export class SkeletonJailer extends Monster {

  constructor() {
    super("skeleton_jailer.jpg", 8);
  }

  override getTokenReward(): Token | null {
    return new SkeletonKey();
  }
}
