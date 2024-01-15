import { Injectable, Optional, SkipSelf } from "@angular/core";
import { Argentus } from "../model/player/argentus";
import { Aderyn } from "../model/player/aderyn";
import { Elspeth } from "../model/player/elspeth";
import { Horan } from "../model/player/horan";
import { Taia } from "../model/player/taia";
import { Victorius } from "../model/player/victorius";
import { Xanros } from "../model/player/xanros";
import { Player } from "../model/player/player";

/**
 * Provides the set of all possible characters.
 */
@Injectable()
export class PlayerService {

  private playableCharacters = new Array<Player>();

  constructor(
    @Optional() @SkipSelf() service: PlayerService) {
    if (service) {
      throw new Error('Singleton violation: PlayerService');
    }

    this.playableCharacters.push(new Aderyn());
    this.playableCharacters.push(new Argentus());
    this.playableCharacters.push(new Elspeth());
    this.playableCharacters.push(new Horan());
    this.playableCharacters.push(new Taia());
    this.playableCharacters.push(new Victorius());
    this.playableCharacters.push(new Xanros());
  }

  getPlayableCharacters(): Array<Player> {
    return this.playableCharacters;
  }
}