import { Monster } from "./monster";
import { HealingTeleport } from "../spell/healing-teleport";
import { Cell } from "../../cell";
import { Player } from "../../player/player";

export class GiantSpider extends Monster {

  constructor() {
    super("giant_spider.jpg", 6);
  }

  override handleDefeat(player: Player, cell: Cell): void {
    cell.replaceToken(new HealingTeleport());
  }
}
