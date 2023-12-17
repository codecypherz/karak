import { Component, Input } from '@angular/core';
import { Game } from 'src/app/model/game';

@Component({
  selector: 'app-player-sheets',
  templateUrl: './player-sheets.component.html',
  styleUrls: ['./player-sheets.component.scss']
})
export class PlayerSheetsComponent {

  @Input() game!: Game;
}
