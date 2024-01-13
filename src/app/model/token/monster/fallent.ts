import { Cell } from "../../cell";
import { Player } from "../../player";
import { Monster } from "./monster";

export class Fallen extends Monster {

  constructor() {
    super("fallen.jpg", 12);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.removeToken();
    player.addTreasure(1);
  }
}
