import { Component, OnDestroy } from '@angular/core';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-player-sheets',
  templateUrl: './player-sheets.component.html',
  styleUrls: ['./player-sheets.component.scss']
})
export class PlayerSheetsComponent {

  game!: Game;

  constructor(
    private gameService: GameService) {
      this.game = this.gameService.getGame();
  }
}
