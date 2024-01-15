import { Cell } from "../cell";
import { Dungeon } from "../dungeon";
import { Spell } from "../token/spell/spell";
import { Player } from "./player";

export class Argentus extends Player {

  constructor() {
    super('Argentus', 'Argentus the Wizard', 'argentus.jpg', 'argentus_icon.jpg');
  }

  protected override getConnectedCells(cell: Cell, dungeon: Dungeon): Set<Cell> {
    if (this.isCursed()) {
      return super.getConnectedCells(cell, dungeon);
    }
    const cellsWithTiles = new Set<Cell>();
    dungeon.getSurroundingCells(cell).forEach(c => {
      if (c.hasTile()) {
        cellsWithTiles.add(c);
      }
    });
    return cellsWithTiles;
  }

  protected override shouldConsumeCombatSpell(spell: Spell | null): boolean {
    if (this.isCursed()) {
      return super.shouldConsumeCombatSpell(spell);
    }
    return false;
  }
}
