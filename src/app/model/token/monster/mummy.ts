import { Cell } from "../../cell";
import { Player } from "../../player";
import { Monster } from "./monster";

export class Mummy extends Monster {

  constructor() {
    super("mummy.jpg", 7);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.removeToken();
    player.startMovingCurse();
  }
}
