import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-player-sheet',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss']
})
export class PlayerSheetComponent {

  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  endTurnDisabled(): boolean {
    const game = this.gameService.getGame();
    return !game.canEndTurn();
  }

  endTurn(): void {
    const game = this.gameService.getGame();
    game.startNextTurn();
  }
}
