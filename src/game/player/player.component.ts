import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  @Input() player!: Player;
  @Input() index!: number;

  getClass(): string {
    return "player index" + this.index;
  }
}
