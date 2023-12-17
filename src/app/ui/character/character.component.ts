import { Component, Input, OnInit } from '@angular/core';
import { Character } from 'src/app/model/character';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  @Input() character!: Character;

  ngOnInit(): void {
    // Reset the Character when initialized.
    this.character.setSelected(false);
  }

  isSelected(): boolean {
    return this.character.isSelected();
  }

  toggleSelect(): void {
    this.character.toggleSelect();
  }
}
