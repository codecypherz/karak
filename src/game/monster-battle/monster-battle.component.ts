import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player';

@Component({
  selector: 'app-monster-battle',
  templateUrl: './monster-battle.component.html',
  styleUrls: ['./monster-battle.component.scss']
})
export class MonsterBattleComponent {

  @Input() player!: Player;
}
