import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';

export class Player {

  private id = uuidv4();
  private active = false;
  private actionsRemaining = 0;

  constructor(
    readonly character: Character) {
  }

  getId(): string {
    return this.id;
  }

  startTurn(): void {
    this.active = true;
    this.actionsRemaining = 4;
  }

  endTurn(): void {
    this.active = false;
    this.actionsRemaining = 0;
  }

  isActive(): boolean {
    return this.active;
  }

  getActionsRemaining(): number {
    return this.actionsRemaining;
  }
}
