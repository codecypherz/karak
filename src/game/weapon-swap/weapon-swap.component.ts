import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';
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
    this.player.cancelSwap();
  }

  swapWeaponOne(): void {
    this.player.setTokenToDiscard(this.player.getWeaponOne()!);
  }

  swapWeaponTwo(): void {
    this.player.setTokenToDiscard(this.player.getWeaponTwo()!);
  }

  confirm(): void {
    const cell = this.gameService.getGame().getActivePlayerCell();
    this.player.confirmSwap(cell);
  }

  isWeaponOneSelected(): boolean {
    return this.player.getWeaponOne() == this.player.getTokenToDiscard();
  }

  isWeaponTwoSelected(): boolean {
    return this.player.getWeaponTwo() == this.player.getTokenToDiscard();
  }
}
