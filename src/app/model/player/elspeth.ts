import { Cell } from "../cell";
import { TileBag } from "../tile/tilebag";
import { Monster } from "../token/monster/monster";
import { Player } from "./player";

export class Elspeth extends Player {

  static COMBAT_ABILITY_TEXT = "Dual Attack: You may re-roll any ONE die in combat.";

  private hasRerolled = false;

  constructor() {
    super('Elspeth', 'Elspeth the Warrior Princess', 'elspeth.jpg', 'elspeth_icon.jpg');
  }

  override getCombatAbilityText(): string | null {
    return Elspeth.COMBAT_ABILITY_TEXT;
  }

  override startTurn(): void {
    this.hasRerolled = false;
    super.startTurn();
  }

  override canRerollDieOne(): boolean {
    if (this.isCursed()) {
      return super.canRerollDieOne();
    }
    return !this.hasRerolled;
  }

  override canRerollDieTwo(): boolean {
    if (this.isCursed()) {
      return super.canRerollDieTwo();
    }
    return !this.hasRerolled;
  }

  override rerollDieOne(): void {
    this.hasRerolled = true;
    super.rerollDieOne();
  }

  override rerollDieTwo(): void {
    this.hasRerolled = true;
    super.rerollDieTwo();
  }

  protected override automaticallyStartCombat(): boolean {
    if (this.isCursed()) {
      return super.automaticallyStartCombat();
    }
    if (this.getActionsRemaining() <= 0 || this.getHitPoints() <= 1) {
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

  override startExploring(playerCell: Cell, targetCell: Cell, tileBag: TileBag): void {
    if (this.isCursed()) {
      super.startExploring(playerCell, targetCell, tileBag);
      return;
    }

    if (this.hasMonster(playerCell)) {
      this.reduceHitPoints();
    }
    super.startExploring(playerCell, targetCell, tileBag);
  }

  override moveTo(playerCell: Cell, targetCell: Cell): void {
    if (this.isCursed()) {
      super.moveTo(playerCell, targetCell);
      return;
    }

    if (this.hasMonster(playerCell)) {
      this.reduceHitPoints();
    }
    super.moveTo(playerCell, targetCell);
  }
}
