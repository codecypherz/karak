import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-player-sheet',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss']
})
export class PlayerSheetComponent {

  static HEALTH_IMAGE = "/images/token/health.jpg";
  static DAMAGE_IMAGE = "/images/token/damage.jpg";

  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  getHpSlotImageUrl(hpSlot: number): string {
    if (this.player.getHitPoints() >= hpSlot) {
      return PlayerSheetComponent.HEALTH_IMAGE;
    }
    return PlayerSheetComponent.DAMAGE_IMAGE;
  }

  endTurnDisabled(): boolean {
    const game = this.gameService.getGame();
    return !game.canEndTurn();
  }

  endTurn(): void {
    const game = this.gameService.getGame();
    game.startNextTurn();
  }
}
