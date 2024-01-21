import { Sound } from "src/app/util/sound";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Monster } from "./monster";

export class Dragon extends Monster {

  constructor() {
    super("Dragon", "dragon.jpg", 15);
  }

  override revealed(): void {
    Sound.DRAGON_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.removeToken();
    player.addTreasure(1.5);
    Sound.DRAGON_DEFEAT.play();
  }
}
