import { Character } from './character';

export class Player {

  private active = false;

  constructor(
    readonly character: Character) {
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  isActive(): boolean {
    return this.active;
  }
}
