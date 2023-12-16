import { Injectable, Optional, SkipSelf } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { Game } from "src/app/model/game";
import { GameCollection } from "../collection/game-collection";

/**
 * Provides behavior and simple extractions of intent.
 */
@Injectable()
export class GameService {

  private game: Game | null = null;

  constructor(
    private logger: NGXLogger,
    private gameCollection: GameCollection,
    @Optional() @SkipSelf() service?: GameService) {

    if (service) {
      throw new Error('Singleton violation: GameService');
    }
  }

  startGame(game: Game): void {
    if (this.game != null) {
      throw new Error('Cannot start a game with one already active.');
    }
    this.logger.info(`Starting game: ${game.getId()}`);

    this.game = game;
    this.gameCollection.addCreatedGame(this.game);

    this.game.start();
  }

  endGame(): void {
    if (this.game == null) {
      return;
    }
    this.game = null;
  }

  isGameActive(): boolean {
    return this.game != null;
  }

  getGame(): Game {
    // Throws if game hasn't been set.
    return this.game!;
  }
}
