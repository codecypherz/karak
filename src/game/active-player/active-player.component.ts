import { Component, Input } from '@angular/core';
import { Game } from 'src/app/model/game';
import { Player } from 'src/app/model/player';

@Component({
  selector: 'app-active-player',
  templateUrl: './active-player.component.html',
  styleUrls: ['./active-player.component.scss']
})
export class ActivePlayerComponent {

  @Input() game!: Game;

  getActivePlayer(): Player {
    return this.game.getActivePlayer();
  }

  endTurnDisabled(): boolean {
    return !this.game.canEndTurn();
  }

  endTurn(): void {
    this.game.startNextTurn();
  }
}
