import { CombatResult, Player } from "./player";

export class Horan extends Player {

  static COMBAT_ABILITY_TEXT = "Double Attack: If you fail your combat roll,"
      + " roll again. You only lose if you fail your second roll.";

  private hasRerolled = false;

  constructor() {
    super('Horan', 'Horan the Warrior', 'horan.jpg', 'horan_icon.jpg');
  }

  override getCombatAbilityText(): string | null {
    return Horan.COMBAT_ABILITY_TEXT;
  }

  override startTurn(): void {
    this.hasRerolled = false;
    super.startTurn();
  }

  override canRerollCombat(): boolean {
    if (this.isCursed()) {
      return super.canRerollCombat();
    }
    return !this.hasRerolled && this.getPendingCombatResult() != CombatResult.WIN;
  }

  override rerollCombat(): void {
    this.hasRerolled = true;
    super.rerollCombat();
  }

  override canConfirmCombatResult(): boolean {
    if (this.isCursed()) {
      return super.canConfirmCombatResult();
    }
    if (this.hasRerolled) {
      return super.canConfirmCombatResult();
    }
    // You can only confirm a win. Reroll is required on tie or lose.
    if (this.getPendingCombatResult() == CombatResult.WIN) {
      return super.canConfirmCombatResult();
    }
    return false;
  }
}
