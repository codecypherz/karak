import { Component, Input } from '@angular/core';
import { CombatResult, Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-weapon-swap',
  templateUrl: './weapon-swap.component.html',
  styleUrls: ['./weapon-swap.component.scss']
})
export class WeaponSwapComponent {

  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  cancel(): void {
    this.gameService.getGame().cancelSwap();
  }

  swapWeaponOne(): void {
    this.player.setTokenToSwap(this.player.getWeaponOne()!);
  }

  swapWeaponTwo(): void {
    this.player.setTokenToSwap(this.player.getWeaponTwo()!);
  }

  confirm(): void {
    this.gameService.getGame().confirmSwap();
  }

  isWeaponOneSelected(): boolean {
    return this.player.getWeaponOne() == this.player.getTokenToSwap();
  }

  isWeaponTwoSelected(): boolean {
    return this.player.getWeaponTwo() == this.player.getTokenToSwap();
  }
}
