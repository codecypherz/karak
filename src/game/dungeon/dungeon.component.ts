import { Component, Input } from '@angular/core';
import { Dungeon } from 'src/app/model/dungeon';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent {

  @Input() dungeon!: Dungeon;

  mouseDown = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  startDragging(e: MouseEvent, flag: boolean, container: HTMLElement): void {
    console.log(e);
    this.mouseDown = true;
    this.startX = e.pageX - container.offsetLeft;
    this.startY = e.pageY - container.offsetTop;
    this.scrollLeft = container.scrollLeft;
    this.scrollTop = container.scrollTop;
  }

  stopDragging(e: MouseEvent, flag: boolean): void {
    this.mouseDown = false;
  }

  moveEvent(e: MouseEvent, container: HTMLElement): void {
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    const x = e.pageX - container.offsetLeft;
    const y = e.pageY - container.offsetTop;
    const scrollX = x - this.startX;
    const scrollY = y - this.startY;
    container.scrollLeft = this.scrollLeft - scrollX;
    container.scrollTop = this.scrollTop - scrollY;
  }
}
