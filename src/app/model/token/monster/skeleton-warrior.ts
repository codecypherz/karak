import { Monster } from "./monster";
import { Sword } from "../weapon/sword";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Sound } from "src/app/util/sound";

export class SkeletonWarrior extends Monster {

  constructor() {
    super("Skeleton Warrior", "skeleton_warrior.jpg", 9);
  }

  override revealed(): void {
    Sound.BONES_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new Sword());
    Sound.BONES_DEFEAT.play();
  }
}
