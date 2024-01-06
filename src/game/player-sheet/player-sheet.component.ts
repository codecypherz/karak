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
    const damage = 5 - this.player.getHitPoints();
    if (damage >= hpSlot) {
      return PlayerSheetComponent.DAMAGE_IMAGE;
    }
    return PlayerSheetComponent.HEALTH_IMAGE;
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
