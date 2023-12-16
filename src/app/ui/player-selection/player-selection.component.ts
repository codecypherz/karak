import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.scss']
})
export class PlayerSelectionComponent {

  private game = new Game();

  constructor(
    private gameService: GameService,
    private router: Router) {
  }

  startGame(): void {
    this.gameService.startGame(this.game);
    this.router.navigate(['game', this.game.getId()]);
  }
}
