import { removeRandom } from "src/app/util/arrays";
import { Token } from "./token";
import { GiantRat } from "./giant-rat";
import { Treasure } from "./treasture";

export class TokenBag {

  private tokens = new Array<Token>();

  constructor() {

    // Official numbers
    // ===========================

    // Base Game (53 tokens):
    //
    // 1  Dragon
    // 2  Fallen
    // 12 Skeleton Jailers
    // 3  Skeleton Kings
    // 5  Skeleton Warriors
    // 8  Giant Rats
    // 4  Giant Spiders
    // 8  Mummies
    // 10 Treasure
    //

    // Regent Expansion (8 tokens):
    //
    // 6 Bats
    // 2 Skeleton Mage
    //

    for (let i = 0; i < 8; i++) {
      this.tokens.push(new GiantRat());
    }
    for (let i = 0; i < 10; i++) {
      this.tokens.push(new Treasure());
    }
  }

  isEmpty(): boolean {
    return this.tokens.length == 0;
  }

  drawToken(): Token {
    return removeRandom(this.tokens);
  }

  getNumTokens(): number {
    return this.tokens.length;
  }
}
