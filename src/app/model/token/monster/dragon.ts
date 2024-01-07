import { Monster } from "./monster";
import { Token } from "../token";
import { DragonTreasure } from "../dragon-treasure";

export class Dragon extends Monster {

  constructor() {
    super("dragon.jpg", 15);
  }

  getReward(): Token {
    return new DragonTreasure();
  }
}
