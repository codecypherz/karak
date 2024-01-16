import { Cell } from "../cell";
import { Monster } from "../token/monster/monster";
import { CombatResult, Player } from "./player";

export class Aderyn extends Player {

  static COMBAT_ABILITY_TEXT = "Backstab: You win ties in combat.";

  constructor() {
    super('Aderyn', 'Aderyn the Thief', 'aderyn.jpg', 'aderyn_icon.jpg');
  }

  override getCombatAbilityOneText(): string | null {
    return Aderyn.COMBAT_ABILITY_TEXT;
  }

  protected override getCombatResult(
      monsterStrength: number, playerStrength: number): CombatResult {
    if (this.isCursed()) {
      return super.getCombatResult(monsterStrength, playerStrength);
    }
    if (monsterStrength <= playerStrength) {
      return CombatResult.WIN;
    }
    return CombatResult.LOSS;
  }

  protected override automaticallyStartCombat(): boolean {
    if (this.isCursed()) {
      return super.automaticallyStartCombat();
    }
    if (this.getActionsRemaining() <= 0) {
      return true;
    }
    return false;
  }

  protected override showFightable(targetCell: Cell, playerCell: Cell): boolean {
    if (this.isCursed()) {
      return super.showFightable(targetCell, playerCell);
    }
    if (this.isBusy() || this.isDead()) {
      return false;
    }
    if (targetCell != playerCell) {
      return false;
    }
    if (!targetCell.hasTile()) {
      return false;
    }
    if (!targetCell.hasToken()) {
      return false;
    }
    const token = targetCell.getToken();
    return token instanceof Monster;
  }
}
