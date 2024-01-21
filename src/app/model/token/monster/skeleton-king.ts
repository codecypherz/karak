import { Monster } from "./monster";
import { BattleAxe } from "../weapon/battle-axe";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Sound } from "src/app/util/sound";

export class SkeletonKing extends Monster {

  constructor() {
    super("Skeleton King", "skeleton_king.jpg", 10);
  }

  override revealed(): void {
    Sound.BONES_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new BattleAxe());
    Sound.BONES_DEFEAT.play();
  }
}
