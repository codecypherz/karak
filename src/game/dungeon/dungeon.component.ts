import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dungeon } from 'src/app/model/dungeon';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.scss']
})
export class DungeonComponent implements OnInit, OnDestroy {

  @Input() dungeon!: Dungeon;
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  private draggingStarted = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

  private autoScrolled = false;

  ngOnInit(): void {
    this.autoScrolled = false;
  }

  ngAfterViewChecked(): void {
    if (this.autoScrolled) {
      return;
    }
    // This centers the starting tile on the screen.
    const el = this.container.nativeElement;
    el.scrollLeft = Math.abs(el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = Math.abs(el.scrollHeight - el.clientHeight) / 2;
    this.autoScrolled = true;
  }

  ngOnDestroy(): void {
    this.autoScrolled = false;
  }

  startMouseDragging(e: MouseEvent, flag: boolean, container: HTMLElement): void {
    this.startDragging(e.pageX, e.pageY, container);
  }

  startTouchDragging(e: TouchEvent, flag: boolean, container: HTMLElement): void {
    // Only handle single touch events.
    if (e.touches.length != 1) {
      return;
    }
    let touch = e.touches[0];
    this.startDragging(touch.pageX, touch.pageY, container);
  }

  private startDragging(pageX: number, pageY: number, container: HTMLElement): void {
    this.draggingStarted = true;
    this.startX = pageX - container.offsetLeft;
    this.startY = pageY - container.offsetTop;
    this.scrollLeft = container.scrollLeft;
    this.scrollTop = container.scrollTop;
  }

  stopMouseDragging(e: MouseEvent, flag: boolean): void {
    this.stopDragging();
  }

  stopTouchDragging(e: TouchEvent, flag: boolean): void {
    this.stopDragging();
  }

  private stopDragging(): void {
    this.draggingStarted = false;
  }

  moveMouseEvent(e: MouseEvent, container: HTMLElement): void {
    e.preventDefault();
    this.moveEvent(e.pageX, e.pageY, container);
  }

  moveTouchEvent(e: TouchEvent, container: HTMLElement): void {
    // Only handle single touch events.
    if (e.touches.length != 1) {
      return;
    }
    let touch = e.touches[0];
    e.preventDefault();
    this.moveEvent(touch.pageX, touch.pageY, container);
  }

  private moveEvent(pageX: number, pageY: number, container: HTMLElement): void {
    if (!this.draggingStarted) {
      return;
    }
    const x = pageX - container.offsetLeft;
    const y = pageY - container.offsetTop;
    const scrollX = x - this.startX;
    const scrollY = y - this.startY;
    container.scrollLeft = this.scrollLeft - scrollX;
    container.scrollTop = this.scrollTop - scrollY;
  }
}
