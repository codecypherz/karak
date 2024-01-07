import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/model/cell';
import { Player } from 'src/app/model/player';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() cell!: Cell;

  constructor(private gameService: GameService) {}

  getActivePlayerInCell(): Player | null {
    const activePlayer = this.gameService.getGame().getActivePlayer();
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
    this.gameService.getGame().moveTo(this.cell);
  }

  pickUp(): void {
    this.gameService.getGame().pickUp(this.cell);
  }

  openTreasure(): void {
    this.gameService.getGame().openTreasure(this.cell);
  }

  isSwappingWeapons(): boolean {
    const activePlayer = this.getActivePlayerInCell();
    if (activePlayer == null) {
      return false;
    }
    return activePlayer.isSwappingWeapons();
  }

  explore(): void {
    this.gameService.getGame().explore(this.cell);
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
    return !this.gameService.getGame().canConfirmExplore(this.cell);
  }
  
  confirmExplore(): void {
    this.gameService.getGame().confirmExplore(this.cell);
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
