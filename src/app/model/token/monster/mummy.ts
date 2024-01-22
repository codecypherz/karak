import { Sound } from "src/app/util/sound";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { FireBolt } from "../spell/fire-bolt";
import { Monster } from "./monster";

export class Mummy extends Monster {

  constructor() {
    super("Mummy", "mummy.jpg", 7);
  }

  override revealed(): void {
    Sound.MUMMY_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    Sound.MUMMY_DEFEAT.play();
    cell.replaceToken(new FireBolt());
    player.startMovingCurse();
  }
}
