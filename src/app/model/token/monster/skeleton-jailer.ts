import { Monster } from "./monster";
import { SkeletonKey } from "../skeleton-key";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Sound } from "src/app/util/sound";

export class SkeletonJailer extends Monster {

  constructor() {
    super("Skeleton Jailer", "skeleton_jailer.jpg", 8);
  }

  override revealed(): void {
    Sound.BONES_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    Sound.BONES_DEFEAT.play();
    cell.replaceToken(new SkeletonKey());
  }
}
