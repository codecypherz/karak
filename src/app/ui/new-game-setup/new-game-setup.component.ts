import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterCollection } from 'src/app/collection/character-collection';
import { Character } from 'src/app/model/character';
import { Game } from 'src/app/model/game';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-new-game-setup',
  templateUrl: './new-game-setup.component.html',
  styleUrls: ['./new-game-setup.component.scss']
})
export class NewGameSetupComponent {

  private invalidGameStart = false;

  constructor(
    private characterCollection: CharacterCollection,
    private gameService: GameService,
    private router: Router) {
  }

  getCharacters(): Array<Character> {
    return this.characterCollection.getCharacters();
  }

  startGame(): void {
    this.invalidGameStart = false;
    const game = new Game();
    for (let character of this.characterCollection.getCharacters()) {
      if (character.isSelected()) {
        game.addPlayer(new Player(character));
      }
    }

    if (!game.isValidToStart()) {
      this.invalidGameStart = true;
      return;
    }

    this.gameService.startGame(game);
    this.router.navigate(['game', game.getId()]);
  }

  showError(): boolean {
    return this.invalidGameStart;
  }
}
