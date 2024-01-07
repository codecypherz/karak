import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoggerModule } from 'ngx-logger';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { PlayerSheetsComponent } from './player-sheets/player-sheets.component';
import { DungeonComponent } from './dungeon/dungeon.component';
import { PlayerSheetComponent } from './player-sheet/player-sheet.component';
import { CellComponent } from './cell/cell.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { PlayerComponent } from './player/player.component';
import { MonsterBattleComponent } from './monster-battle/monster-battle.component';
import { WeaponSwapComponent } from './weapon-swap/weapon-swap.component';

@NgModule({
  imports: [
    CommonModule,
    LoggerModule.forChild(),
    GameRoutingModule,
  ],
  declarations: [
    CellComponent,
    DungeonComponent,
    GameComponent,
    GameInfoComponent,
    GameOverComponent,
    MonsterBattleComponent,
    PlayerComponent,
    PlayerSheetComponent,
    PlayerSheetsComponent,
    WeaponSwapComponent,
  ],
})
export class GameModule { }
