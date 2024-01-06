import { v4 as uuidv4 } from 'uuid';
import { Character } from './character';
import { Position } from './position';
import { Monster } from './token/monster';
import { Token } from './token/token';
import { Item } from './token/item';
import { Weapon } from './token/weapon';

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

  private hitPoints = 5;

  private activeMonster: Monster | null = null;
  private hadCombat = false;
  private dieOne = 0;
  private dieTwo = 0;
  private madeCombatRoll = false;

  private weaponOne: Weapon | null = null;
  private weaponTwo: Weapon | null = null;

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

  moveToLastPosition(): void {
    this.position = this.lastPosition;
  }

  getLastPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.lastPosition!;
  }

  getPosition(): Position {
    // Assumed to only be accessed after game start.
    return this.position!;
  }

  getHitPoints(): number {
    return this.hitPoints;
  }

  reduceHitPoints(): void {
    if (this.hitPoints > 0) {
      this.hitPoints--;
    }
  }

  setHitPoints(hitPoints: number) {
    if (hitPoints < 0 || hitPoints > 5) {
      throw new Error('Invalid hit points.');
    }
    this.hitPoints = hitPoints;
  }

  getWeaponOne(): Weapon | null {
    return this.weaponOne;
  }

  getWeaponTwo(): Weapon | null {
    return this.weaponTwo;
  }

  startCombat(monster: Monster): void {
    this.activeMonster = monster;
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
    return this.dieOne + this.dieTwo + this.getCombatBonus();
  }

  getCombatBonus(): number {
    let bonus = 0;
    if (this.weaponOne != null) {
      bonus += this.weaponOne.getStrength();
    }
    if (this.weaponTwo != null) {
      bonus += this.weaponTwo.getStrength();
    }
    return bonus;
  }

  canConfirmCombatResult(): boolean {
    return this.hasMadeCombatRoll();
  }

  confirmCombatResult(): void {
    if (!this.isInCombat()) {
      throw new Error('Player not in combat.');
    }

    const combatResult = this.getPendingCombatResult();

    this.activeMonster = null;
    this.madeCombatRoll = false;
    this.hadCombat = true;
    this.actionsRemaining = 0;
    this.dispatchEvent(new CombatConfirmedEvent(combatResult));
  }

  hasHadCombat(): boolean {
    return this.hadCombat;
  }

  canPickUp(token: Token): boolean {
    return token instanceof Item;
  }

  pickUp(token: Token) {
    if (!this.canPickUp(token)) {
      throw Error('Cannot pick up token.');
    }

    if (token instanceof Weapon) {
      if (this.weaponOne == null) {
        this.weaponOne = token;
      } else if (this.weaponTwo == null) {
        this.weaponTwo = token;
      } else {
        throw new Error('TODO: Handle weapon swaps.');
      }
    }
  }

  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}

export class CombatConfirmedEvent extends Event {

  constructor(readonly combatResult: CombatResult) {
    super(Player.COMBAT_CONFIRMED_EVENT);
  }
}