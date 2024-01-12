import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-player-sheet',
  templateUrl: './player-sheet.component.html',
  styleUrls: ['./player-sheet.component.scss'],
  animations: [
    trigger('deadAlive', [
      state('dead', style({
        filter: 'brightness(30%)',
      })),
      state('alive', style({
        filter: 'inherit',
      })),
      transition('* => *', [
        animate('1s ease-in-out')
      ]),
    ]),
  ]
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
    return !this.gameService.getGame().canEndTurn();
  }

  endTurn(): void {
    this.gameService.getGame().endTurn();
  }
}
