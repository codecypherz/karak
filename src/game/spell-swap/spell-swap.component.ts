import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-spell-swap',
  templateUrl: './spell-swap.component.html',
  styleUrls: ['./spell-swap.component.scss']
})
export class SpellSwapComponent {

  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  cancel(): void {
    this.player.cancelSwap();
  }

  swapSpellOne(): void {
    this.player.setTokenToDiscard(this.player.getSpellOne()!);
  }

  swapSpellTwo(): void {
    this.player.setTokenToDiscard(this.player.getSpellTwo()!);
  }

  swapSpellThree(): void {
    this.player.setTokenToDiscard(this.player.getSpellThree()!);
  }

  confirm(): void {
    const cell = this.gameService.getGame().getActivePlayerCell();
    this.player.confirmSwap(cell);
  }

  isSpellOneSelected(): boolean {
    return this.player.getSpellOne() == this.player.getTokenToDiscard();
  }

  isSpellTwoSelected(): boolean {
    return this.player.getSpellTwo() == this.player.getTokenToDiscard();
  }

  isSpellThreeSelected(): boolean {
    return this.player.getSpellThree() == this.player.getTokenToDiscard();
  }
}
