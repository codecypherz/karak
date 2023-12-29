import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';

export class Player {

  private active = false;
  private id = uuidv4();

  constructor(
    readonly character: Character) {
  }

  getId(): string {
    return this.id;
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  isActive(): boolean {
    return this.active;
  }
}
