import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/model/cell';
import { Player } from 'src/app/model/player/player';
import { Monster } from 'src/app/model/token/monster/monster';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() cell!: Cell;

  constructor(private gameService: GameService) {}

  getActivePlayer(): Player {
    return this.gameService.getGame().getActivePlayer();
  }

  getActivePlayerInCell(): Player | null {
    const activePlayer = this.getActivePlayer();
    if (this.isPlayerInCell(activePlayer)) {
      return activePlayer;
    }
    return null;
  }

  getInactivePlayersInCell(): Array<Player> {
    return this.gameService.getGame().getPlayers().filter(player => {
      return !player.isActive() && this.isPlayerInCell(player);
    });
  }

  move(): void {
    this.getActivePlayer().moveTo(
      this.gameService.getGame().getActivePlayerCell(), this.cell);
  }

  fight(): void {
    if (!this.cell.hasToken()) {
      throw new Error('Nothing to fight');
    }
    const token = this.cell.getToken();
    if (!(token instanceof Monster)) {
      throw new Error('Token not a monster');
    }
    this.getActivePlayer().startCombat(token);
  }

  pickUp(): void {
    this.getActivePlayer().pickUp(this.cell);
  }

  openTreasure(): void {
    this.getActivePlayer().openTreasure(this.cell);
  }

  select(): void {
    const activePlayer = this.getActivePlayer();
    if (activePlayer.isCastingHealingTeleport() || activePlayer.isReincarnating()) {
      activePlayer.setHealingTeleportTargetCell(this.cell);
    }
  }

  isSelected(): boolean {
    const activePlayer = this.getActivePlayer();
    if (activePlayer.isCastingHealingTeleport() || activePlayer.isReincarnating()) {
      return activePlayer.getHealingTeleportTargetCell() == this.cell;
    }
    return false;
  }

  isSwappingWeapons(): boolean {
    const activePlayer = this.getActivePlayerInCell();
    if (activePlayer == null) {
      return false;
    }
    return activePlayer.isSwappingWeapons();
  }

  isSwappingSpells(): boolean {
    const activePlayer = this.getActivePlayerInCell();
    if (activePlayer == null) {
      return false;
    }
    return activePlayer.isSwappingSpells();
  }

  isPickingExploreToken(): boolean {
    // Show the token picker dialog above the cell being explored.
    const activePlayer = this.getActivePlayer();
    const exploredCell = activePlayer.getExploredCell();
    return activePlayer.isPickingExploreToken() && exploredCell == this.cell;
  }

  explore(): void {
    const game = this.gameService.getGame();
    this.getActivePlayer().startExploring(
        game.getActivePlayerCell(),
        this.cell,
        game.getTileBag());
  }

  rotateClockwise(): void {
    if (!this.cell.hasTile() || !this.cell.isConfirmingExplore()) {
      throw new Error('Cannot rotate unless exploring.');
    }
    this.cell.getTile()!.rotateClockwise();
  }

  rotateCounterClockwise(): void {
    if (!this.cell.hasTile() || !this.cell.isConfirmingExplore()) {
      throw new Error('Cannot rotate unless exploring.');
    }
    this.cell.getTile()?.rotateCounterClockwise();
  }

  getTileRotationTransform(): string {
    if (!this.cell.hasTile()) {
      return '';
    }
    return 'rotate(' + this.cell.getTile()!.getRotation().degrees + 'deg)';
  }

  confirmDisabled(): boolean {
    return !this.getActivePlayer().canConfirmExploring(
        this.cell, this.gameService.getGame().getDungeon());
  }
  
  confirmExplore(): void {
    this.getActivePlayer().confirmExplore(
        this.cell, this.gameService.getGame().getTokenBag());
  }

  getPlayers(): Set<Player> {
    const game = this.gameService.getGame();
    const players = new Set<Player>();
    game.getPlayers().forEach(player => {
      if (player.getPosition().equals(this.cell.getPosition())) {
        players.add(player);
      }
    });
    return players;
  }

  private isPlayerInCell(player: Player): boolean {
    return player.getPosition().equals(this.cell.getPosition());
  }
}
