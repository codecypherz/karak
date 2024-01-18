import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-explore-pick',
  templateUrl: './explore-pick.component.html',
  styleUrls: ['./explore-pick.component.scss']
})
export class ExplorePickComponent {

  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  selectTokenOne(): void {
    this.player.selectExploreToken(this.player.getExploreTokenOne()!);
  }

  selectTokenTwo(): void {
    this.player.selectExploreToken(this.player.getExploreTokenTwo()!);
  }

  isTokenOneSelected(): boolean {
    return this.player.getSelectedExploreToken() == this.player.getExploreTokenOne();
  }

  isTokenTwoSelected(): boolean {
    return this.player.getSelectedExploreToken() == this.player.getExploreTokenTwo();
  }

  confirmExploreToken(): void {
    const game = this.gameService.getGame();
    this.player.confirmExploreToken(game.getTokenBag());
  }
}
