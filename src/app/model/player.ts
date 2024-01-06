import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';
import { Position } from './position';
import { Monster } from './token/monster';

export enum CombatResult {
  WIN,
  LOSS,
  TIE
}

export class Player extends EventTarget {

  static COMBAT_CONFIRMED_EVENT = 'combat_confirmed';

  private id = uuidv4();
  private active = false;
  private actionsRemaining = 0;

  private lastPosition: Position | null = null; // Null until game start
  private position: Position | null = null; // Null until game start

  private activeMonster: Monster | null = null;
  private hadCombat = false;
  private dieOne = 0;
  private dieTwo = 0;
  private madeCombatRoll = false;

  constructor(
      readonly character: Character) {
    super();
  }

  getId(): string {
    return this.id;
  }

  startTurn(): void {
    this.active = true;
    this.activeMonster = null;
    this.hadCombat = false;
    this.madeCombatRoll = false;
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

  startCombat(monster: Monster): void {
    this.activeMonster = monster;

    // TODO Roll dice
  }

  isInCombat(): boolean {
    return this.activeMonster != null;
  }

  getActiveMonster(): Monster | null {
    return this.activeMonster;
  }

  makeCombatRoll(): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    this.dieOne = this.rollDie();
    this.dieTwo = this.rollDie();
    this.madeCombatRoll = true;
  }

  hasMadeCombatRoll(): boolean {
    return this.madeCombatRoll;
  }

  getDieOne(): number {
    return this.dieOne;
  }

  getDieTwo(): number {
    return this.dieTwo;
  }

  getPendingCombatResult(): CombatResult {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }
    if (!this.canConfirmCombatResult()) {
      throw new Error('Player cannot yet confirm combat result.');
    }

    const monsterStrength = this.activeMonster!.getStrength();
    const playerStrength = this.getCombatStrength();

    if (monsterStrength < playerStrength) {
      return CombatResult.WIN;
    } else if (monsterStrength > playerStrength) {
      return CombatResult.LOSS;
    } else {
      return CombatResult.TIE;
    }
  }

  getCombatStrength(): number {
    return this.dieOne + this.dieTwo;
  }

  canConfirmCombatResult(): boolean {
    return this.hasMadeCombatRoll();
  }

  confirmCombatResult(): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    // TODO Claim reward?

    this.activeMonster = null;
    this.hadCombat = true;
    this.actionsRemaining = 0;
    this.dispatchEvent(new Event(Player.COMBAT_CONFIRMED_EVENT));
  }

  hasHadCombat(): boolean {
    return this.hadCombat;
  }

  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}
