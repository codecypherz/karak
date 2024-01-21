import { Sound } from "src/app/util/sound";
import { Cell } from "../cell";
import { Dungeon } from "../dungeon";
import { Spell } from "../token/spell/spell";
import { Player } from "./player";

export class Argentus extends Player {

  static COMBAT_ABILITY_TEXT = "Magical Affinity: You do not discard "
      + "your Magic Bolt spells after you use them.";

  constructor() {
    super('Argentus', 'Argentus the Wizard', 'argentus.jpg', 'argentus_icon.jpg');
  }

  protected override getUnarmedCombatSound(): Sound {
    return Sound.FIREBALL;
  }

  override getCombatAbilityOneText(): string | null {
    return Argentus.COMBAT_ABILITY_TEXT;
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
