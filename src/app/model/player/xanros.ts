import { Cell } from "../cell";
import { Player } from "./player";

export class Xanros extends Player {

  static COMBAT_ABILITY_BUTTON_TEXT = "Sacrifice"
  static COMBAT_ABILITY_ONE_TEXT = "Spend a health point to add +1"
      + " to your combat result after the dice have been rolled.";
  static PLAYER_ABILITY_BUTTON_TEXT = "Magic Swap";

  private sacrificing = false;

  constructor() {
    super('Xanros', 'Lord Xanros the Warlock', 'xanros.jpg', 'xanros_icon.jpg');
  }

  override startTurn(): void {
    this.sacrificing = false;
    super.startTurn();
  }

  override getCombatAbilityOneText(): string | null {
    return Xanros.COMBAT_ABILITY_ONE_TEXT;
  }

  override getCombatAbilityButtonText(): string | null {
    return Xanros.COMBAT_ABILITY_BUTTON_TEXT;
  }

  override isCombatAbilityButtonEnabled(): boolean {
    return !this.isCursed()
        && this.getHitPoints() > 1
        && this.hasMadeCombatRoll();
  }

  override handleCombatAbilityButtonClick(): void {
    this.sacrificing = !this.sacrificing;
  }

  override isCombatAbilityActive(): boolean {
    return this.sacrificing;
  }

  override getCombatBonus(): number {
    const baseBonus = super.getCombatBonus();
    if (this.isCursed() || !this.sacrificing) {
      return baseBonus;
    }
    return baseBonus + 1;
  }

  override confirmCombatResult(combatCell: Cell): void {
    if (!this.isCursed() && this.sacrificing) {
      this.reduceHitPoints();
    }
    super.confirmCombatResult(combatCell);
  }

  override getPlayerAbilityButtonText(): string | null {
    return Xanros.PLAYER_ABILITY_BUTTON_TEXT;
  }

  override isPlayerAbilityButtonEnabled(): boolean {
    if (this.isCursed()) {
      return super.isPlayerAbilityButtonEnabled();
    }
    // Can only do Magic Swap as the player's first action.
    return this.getActionsRemaining() == 4 && !this.isBusy();
  }

  override handlePlayerAbilityButtonClick(): void {
    this.startSwappingPlayers();
  }
}
