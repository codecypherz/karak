import { Monster } from "./monster";
import { Daggers } from "../weapon/daggers";
import { Cell } from "../../cell";
import { Player } from "../../player/player";

export class GiantRat extends Monster {

  constructor() {
    super("giant_rat.jpg", 5);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new Daggers());
  }
}
