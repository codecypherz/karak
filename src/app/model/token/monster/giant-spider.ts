import { Monster } from "./monster";
import { HealingTeleport } from "../spell/healing-teleport";
import { Cell } from "../../cell";
import { Player } from "../../player/player";
import { Sound } from "src/app/util/sound";

export class GiantSpider extends Monster {

  constructor() {
    super("Giant Spider", "giant_spider.jpg", 6);
  }

  override revealed(): void {
    Sound.SPIDER_REVEAL.play();
  }

  override handleDefeat(player: Player, cell: Cell): void {
    Sound.SPIDER_DEFEAT.play();
    cell.replaceToken(new HealingTeleport());
  }
}
