import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/model/cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() cell!: Cell;

  onClick(): void {
    console.log('clicked cell at ' + this.cell.getPosition().toString());
  }
}
