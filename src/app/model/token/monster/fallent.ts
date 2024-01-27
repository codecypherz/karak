import { Sound } from "src/app/util/sound";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Monster } from "./monster";

export class Fallen extends Monster {

  constructor() {
    super("Fallen", "fallen.jpg", 12);
  }

  override startCombat(): void {
    Sound.FALLEN_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.removeToken();
    player.addTreasure(1);
    Sound.FALLEN_DEFEAT.play();
  }
}
