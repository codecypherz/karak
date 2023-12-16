import { Component, Input } from '@angular/core';
import { Character } from 'src/app/model/character';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent {

  @Input() character!: Character;

  isSelected(): boolean {
    return this.character.isSelected();
  }
  
  toggleSelect(): void {
    this.character.toggleSelect();
  }
}
