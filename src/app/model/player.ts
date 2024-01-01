import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';
import { Position } from './position';

export class Player {

  private id = uuidv4();
  private active = false;
  private actionsRemaining = 0;
  private lastPosition: Position | null = null; // Null until game start
  private position: Position | null = null; // Null until game start

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

  consumeAction(): void {
    if (this.actionsRemaining == 0) {
      throw new Error('No more actions to consume.');
    }
    this.actionsRemaining--;
  }

  getActionsRemaining(): number {
    return this.actionsRemaining;
  }

  hasActionsRemaining(): boolean {
    return this.actionsRemaining > 0;
  }

  /**
   * Use this to initialize the player or to update both positions at once.
   */
  setPositions(position: Position, lastPosition: Position): void {
    this.position = position;
    this.lastPosition = lastPosition;
  }

  /**
   * Normal modification of a player's position.
   * Automatically updates and maintains the last position for the player.
   */
  moveTo(position: Position): void {
    this.lastPosition = this.position;
    this.position = position;
  }

  getLastPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.lastPosition!;
  }

  getPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.position!;
  }
}
