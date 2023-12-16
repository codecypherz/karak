import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {

  @Input() game!: Game;

  constructor(
    private gameService: GameService,
    private router: Router) { }

  ngOnInit(): void {
    this.isGameOver();
  }

  isGameOver(): boolean {
    let gameOver = this.game.isGameOver();
    if (gameOver) {
      // TODO
    }
    return gameOver;
  }

  newGame(): void {
    this.gameService.endGame();
    this.router.navigate(['']);
  }
}
