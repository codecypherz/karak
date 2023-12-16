import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterCollection } from 'src/app/collection/character-collection';
import { Character } from 'src/app/model/character';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-new-game-setup',
  templateUrl: './new-game-setup.component.html',
  styleUrls: ['./new-game-setup.component.scss']
})
export class NewGameSetupComponent {

  private game = new Game();

  constructor(
    private characterCollection: CharacterCollection,
    private gameService: GameService,
    private router: Router) {
  }

  getCharacters(): Array<Character> {
    return this.characterCollection.getCharacters();
  }

  startGame(): void {
    this.gameService.startGame(this.game);
    this.router.navigate(['game', this.game.getId()]);
  }
}
