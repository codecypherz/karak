import { Monster } from "./monster";
import { Daggers } from "../weapon/daggers";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Sound } from "src/app/util/sound";

export class GiantRat extends Monster {

  constructor() {
    super("Giant Rat", "giant_rat.jpg", 5);
  }

  override startCombat(): void {
    Sound.RAT_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    Sound.RAT_DEFEAT.play();
    cell.replaceToken(new Daggers());
  }
}
