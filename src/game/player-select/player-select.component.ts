import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-player-select',
  templateUrl: './player-select.component.html',
  styleUrls: ['./player-select.component.scss']
})
export class PlayerSelectComponent {

  @Input() selectionTitle!: string;
  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  getPlayers(): Array<Player> {
    return this.gameService.getGame().getPlayersInOrder();
  }

  cancel(): void {
    if (this.player.isCastingHealingTeleport()) {
      this.player.cancelHealingTeleport();
    }
  }

  selectPlayer(player: Player): void {
    if (this.player.isCastingHealingTeleport()) {
      this.player.setHealingTeleportTargetPlayer(player);
    }
  }

  canConfirm(): boolean {
    if (this.player.isCastingHealingTeleport()) {
      return this.player.canConfirmHealingTeleport();
    }
    return false;
  }

  confirm(): void {
    if (this.player.isCastingHealingTeleport()) {
      this.player.confirmHealingTeleport();
    }
  }

  isPlayerSelected(player: Player): boolean {
    return this.player.getHealingTeleportTargetPlayer() == player;
  }
}
