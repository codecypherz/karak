import { removeRandom } from "src/app/util/arrays";
import { Token } from "./token";
import { Rat } from "./rat";

export class TokenBag {

  private tokens = new Array<Token>();

  constructor() {
    for (let i = 0; i < 5; i++) {
      this.tokens.push(new Rat());
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
