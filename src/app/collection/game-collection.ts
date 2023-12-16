import { Injectable, Optional, SkipSelf } from "@angular/core";
import { Game } from "../model/game";

/**
 * Keeps track of created games.
 */
@Injectable()
export class GameCollection {

  private createdGames = new Array<Game>();

  constructor(
    @Optional() @SkipSelf() service: GameCollection) {
    if (service) {
      throw new Error('Singleton violation: GameCollection');
    }
  }

  addCreatedGame(game: Game): void {
    this.createdGames.push(game);
  }

  findById(id: string): Game | null {
    for (let game of this.createdGames) {
      if (game.getId() == id) {
        return game;
      }
    }
    return null;
  }
}