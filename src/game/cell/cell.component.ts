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

  onClick(): void {
    //console.log('clicked cell at ' + this.cell.getPosition().toString());
  }

  explore(): void {
    const game = this.gameService.getGame();
    game.explore(this.cell);
  }

  hasPlayers(): boolean {
    return this.getPlayers().size > 0;
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
}
