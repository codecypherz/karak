import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';
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
    const players = this.gameService.getGame().getPlayersInOrder();
    if (this.player.isSwappingPlayers()) {
      // Exclude the active player from the set of choices.
      return players.filter(p => p != this.player);
    }
    return players;
  }

  showCancel(): boolean {
    return this.player.isCastingHealingTeleport() || this.player.isSwappingPlayers();
  }

  cancel(): void {
    if (this.player.isCastingHealingTeleport()) {
      this.player.cancelHealingTeleport();
    } else if (this.player.isSwappingPlayers()) {
      this.player.cancelPlayerSwap();
    }

  }

  selectPlayer(player: Player): void {
    player.getSelectedSound().play();
    if (this.player.isMovingCurse()) {
      this.player.setCurseTarget(player);
    } else if (this.player.isCastingHealingTeleport()) {
      this.player.setHealingTeleportTargetPlayer(player);
    } else if (this.player.isSwappingPlayers()) {
      this.player.setPlayerSwapTarget(player);
    }
  }

  canConfirm(): boolean {
    if (this.player.isMovingCurse()) {
      return this.player.canConfirmCurseMove();
    } else if (this.player.isCastingHealingTeleport()) {
      return this.player.canConfirmHealingTeleport();
    } else if (this.player.isSwappingPlayers()) {
      return this.player.canConfirmPlayerSwap();
    }
    return false;
  }

  confirm(): void {
    if (this.player.isMovingCurse()) {
      this.player.confirmCurseMove();
    } else if (this.player.isCastingHealingTeleport()) {
      this.player.confirmHealingTeleport();
    } else if (this.player.isSwappingPlayers()) {
      this.player.confirmPlayerSwap();
    }
  }

  isPlayerSelected(player: Player): boolean {
    if (this.player.isMovingCurse()) {
      return this.player.getCurseTarget() == player;
    } else if (this.player.isCastingHealingTeleport()) {
      return this.player.getHealingTeleportTargetPlayer() == player;
    } else if (this.player.isSwappingPlayers()) {
      return this.player.getPlayerSwapTarget() == player;
    }
    return false;
  }
}
