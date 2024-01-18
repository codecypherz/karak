import { Monster } from "../token/monster/monster";
import { Player } from "./player";

export class Victorius extends Player {

  static COMBAT_ABILITY_ONE_TEXT = "Combat Training: Re-roll any 1s during combat";
  static COMBAT_ABILITY_TWO_TEXT = "Invincible: If you rolled any 6s during combat"
      + " you can continue your turn, even if you lost the combat.";

  private sixRolledInLastCombat = false;

  constructor() {
    super('Victorius', 'Victorius the Swordsman', 'victorius.jpg', 'victorius_icon.jpg');
  }

  override startTurn(): void {
    this.sixRolledInLastCombat = false;
    super.startTurn();
  }

  override getCombatAbilityOneText(): string | null {
    return Victorius.COMBAT_ABILITY_ONE_TEXT;
  }

  override getCombatAbilityTwoText(): string | null {
    return Victorius.COMBAT_ABILITY_TWO_TEXT;
  }

  override canRerollDieOne(): boolean {
    if (this.isCursed()) {
      return super.canRerollDieOne();
    }
    return this.hasMadeCombatRoll() && this.getDieOne() == 1;
  }

  override canRerollDieTwo(): boolean {
    if (this.isCursed()) {
      return super.canRerollDieTwo();
    }
    return this.hasMadeCombatRoll() && this.getDieTwo() == 1;
  }

  override startCombat(monster: Monster): void {
    this.sixRolledInLastCombat = false;
    super.startCombat(monster);
  }

  protected override rollDie(): number {
    const roll = super.rollDie();
    if (roll == 6) {
      this.sixRolledInLastCombat = true;
    }
    return roll;
  }

  protected override shouldEndTurnAfterCombat(): boolean {
    if (this.isCursed()) {
      return super.shouldEndTurnAfterCombat();
    }
    return !this.sixRolledInLastCombat;
  }
}
