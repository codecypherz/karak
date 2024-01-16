import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';

@Component({
  selector: 'app-reincarnate',
  templateUrl: './reincarnate.component.html',
  styleUrls: ['./reincarnate.component.scss']
})
export class ReincarnateComponent {

  @Input() player!: Player;

  constructor() {}
}
