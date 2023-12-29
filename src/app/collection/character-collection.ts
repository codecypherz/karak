import { Injectable, Optional, SkipSelf } from "@angular/core";
import { Character } from "../model/character";

/**
 * Provides the set of all possible characters.
 */
@Injectable()
export class CharacterCollection {

  private characters = new Array<Character>();

  constructor(
    @Optional() @SkipSelf() service: CharacterCollection) {
    if (service) {
      throw new Error('Singleton violation: CharacterCollection');
    }

    this.characters.push(new Character("Horan the Warrior", "Horan", "horan.jpg"));
    this.characters.push(new Character("Argentus the Wizard", "Argentus", "argentus.jpg"));
    this.characters.push(new Character("Lord Xanros the Warlock", "Xanros", "xanros.jpg"));
    this.characters.push(new Character("Aderyn the Thief", "Aderyn", "aderyn.jpg"));
    this.characters.push(new Character("Victorius the Swordsman", "Victorius", "victorius.jpg"));
    this.characters.push(new Character("Taia the Oracle", "Taia", "taia.jpg"));
    this.characters.push(new Character("Elspeth the Warrior Princess", "Elspeth", "elspeth.jpg"));
  }

  getCharacters(): Array<Character> {
    return this.characters;
  }
}