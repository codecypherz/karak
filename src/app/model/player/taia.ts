import { Sound } from "src/app/util/sound";
import { Cell } from "../cell";
import { Player } from "./player";

export class Taia extends Player {

  static COMBAT_ABILITY_ONE_TEXT = "Farseeing: If you move on to a tile that has"
      + " a monster for your first action, add +1 to your dice roll.";

  private firstTurnCombatBonus = false;
  
  constructor() {
    super('Taia', 'Taia the Oracle', 'taia.jpg', 'taia_icon.jpg');
  }

  override getSelectedSound(): Sound {
    return Sound.GREETING_TAIA;
  }

  override getCombatAbilityOneText(): string | null {
    return Taia.COMBAT_ABILITY_ONE_TEXT;
  }

  override moveTo(playerCell: Cell, targetCell: Cell): void {
    if (this.getActionsRemaining() == 4 && this.hasMonster(targetCell)) {
      this.firstTurnCombatBonus = true;
    }
    super.moveTo(playerCell, targetCell);
  }

  override getCombatBonus(): number {
    let bonus = super.getCombatBonus();
    if (!this.isCursed() && this.firstTurnCombatBonus) {
      bonus += 1;
    }
    return bonus;
  }

  protected override playerPicksExploreToken(): boolean {
    if (this.isCursed()) {
      return super.playerPicksExploreToken();
    }
    return true;
  }
}
