import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/service/player.service';
import { Game } from 'src/app/model/game';
import { Player } from 'src/app/model/player/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-new-game-setup',
  templateUrl: './new-game-setup.component.html',
  styleUrls: ['./new-game-setup.component.scss']
})
export class NewGameSetupComponent {

  private invalidGameStart = false;

  constructor(
    private playerService: PlayerService,
    private gameService: GameService,
    private router: Router) {
  }

  getPlayableCharacters(): Array<Player> {
    return this.playerService.getPlayableCharacters();
  }

  startGame(): void {
    this.invalidGameStart = false;
    const game = new Game();
    for (let player of this.getPlayableCharacters()) {
      if (player.isSelected()) {
        game.addPlayer(Player.newFrom(player));
      }
    }

    if (!game.isValidToStart()) {
      this.invalidGameStart = true;
      return;
    }
    this.getPlayableCharacters().forEach(p => p.setSelected(false));

    this.gameService.startGame(game);
    this.router.navigate(['game', game.getId()]);
  }

  showError(): boolean {
    return this.invalidGameStart;
  }
}
