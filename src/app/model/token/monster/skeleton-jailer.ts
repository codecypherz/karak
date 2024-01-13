import { Monster } from "./monster";
import { SkeletonKey } from "../skeleton-key";
import { Cell } from "../../cell";
import { Player } from "../../player";

export class SkeletonJailer extends Monster {

  constructor() {
    super("skeleton_jailer.jpg", 8);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new SkeletonKey());
  }
}
