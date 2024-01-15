import { Component, Input } from '@angular/core';
import { Player } from 'src/app/model/player/player';

@Component({
  selector: 'app-playable-character',
  templateUrl: './playable-character.component.html',
  styleUrls: ['./playable-character.component.scss']
})
export class PlayableCharacterComponent {

  @Input() playableCharacter!: Player;
}
