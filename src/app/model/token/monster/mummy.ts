import { Cell } from "../../cell";
import { Player } from "../../player";
import { FireBolt } from "../spell/fire-bolt";
import { Monster } from "./monster";

export class Mummy extends Monster {

  constructor() {
    super("mummy.jpg", 7);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new FireBolt());
    player.startMovingCurse();
  }
}
