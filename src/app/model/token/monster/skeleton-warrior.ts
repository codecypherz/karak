import { Monster } from "./monster";
import { Sword } from "../weapon/sword";
import { Cell } from "../../cell";
import { Player } from "../../player/player";

export class SkeletonWarrior extends Monster {

  constructor() {
    super("skeleton_warrior.jpg", 9);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new Sword());
  }
}
