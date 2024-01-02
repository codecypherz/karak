import { Component, Input } from '@angular/core';
import { Game } from 'src/app/model/game';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent {

  @Input() game!: Game;

  getTilesRemaining(): number {
    return this.game.getTilesRemaining();
  }

  getTokensRemaining(): number {
    return this.game.getTokensRemaining();
  }
}
