import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {

  @Input() game!: Game;

  constructor(
    private gameService: GameService,
    private router: Router) { }

  newGame(): void {
    this.gameService.endGame();
    this.router.navigate(['']);
  }
}
