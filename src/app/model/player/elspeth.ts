import { Cell } from "../cell";
import { TileBag } from "../tile/tilebag";
import { Monster } from "../token/monster/monster";
import { Player } from "./player";

export class Elspeth extends Player {

  constructor() {
    super('Elspeth', 'Elspeth the Warrior Princess', 'elspeth.jpg', 'elspeth_icon.jpg');
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
    }

    if (this.hasMonster(playerCell)) {
      this.reduceHitPoints();
    }
    super.startExploring(playerCell, targetCell, tileBag);
  }

  override moveTo(playerCell: Cell, targetCell: Cell): void {
    if (this.isCursed()) {
      super.moveTo(playerCell, targetCell);
    }

    if (this.hasMonster(playerCell)) {
      this.reduceHitPoints();
    }
    super.moveTo(playerCell, targetCell);
  }

  private hasMonster(cell: Cell): boolean {
    if (cell.hasToken()) {
      const token = cell.getToken()!;
      return token instanceof Monster;
    }
    return false;
  }
}