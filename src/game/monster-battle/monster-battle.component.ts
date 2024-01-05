import { Component, Input } from '@angular/core';
import { CombatResult, Player } from 'src/app/model/player';

@Component({
  selector: 'app-monster-battle',
  templateUrl: './monster-battle.component.html',
  styleUrls: ['./monster-battle.component.scss']
})
export class MonsterBattleComponent {

  @Input() player!: Player;

  getDieOneImageUrl(): string {
    return this.getDieImageUrl(this.player.getDieOne());
  }

  getDieTwoImageUrl(): string {
    return this.getDieImageUrl(this.player.getDieTwo());
  }

  getDieImageUrl(dieValue: number): string {
    const DIE_IMAGES = "/images/die/";

    switch (dieValue) {
      case 1:
        return DIE_IMAGES + "one.png";
      case 2:
        return DIE_IMAGES + "two.png";
      case 3:
        return DIE_IMAGES + "three.png";
      case 4:
        return DIE_IMAGES + "four.png";
      case 5:
        return DIE_IMAGES + "five.png";
      case 6:
        return DIE_IMAGES + "six.png";
    }

    return "";
  }

  getConfirmClass(): string {
    if (!this.player.canConfirmCombatResult()) {
      return "";
    }

    switch (this.player.getPendingCombatResult()) {
      case CombatResult.WIN:
        return "win";
      case CombatResult.LOSS:
        return "loss";
      case CombatResult.TIE:
        return "tie";
    }
  }

  getConfirmText(): string {
    switch (this.player.getPendingCombatResult()) {
      case CombatResult.WIN:
        return "Confirm Win";
      case CombatResult.LOSS:
        return "Confirm Loss";
      case CombatResult.TIE:
        return "Confirm Tie";
    }
  }
}
