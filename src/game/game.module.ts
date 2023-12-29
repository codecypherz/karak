import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoggerModule } from 'ngx-logger';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { PlayerSheetsComponent } from './player-sheets/player-sheets.component';
import { DungeonComponent } from './dungeon/dungeon.component';
import { ActivePlayerComponent } from './active-player/active-player.component';
import { PlayerSheetComponent } from './player-sheet/player-sheet.component';
import { CellComponent } from './cell/cell.component';

@NgModule({
  imports: [
    CommonModule,
    LoggerModule.forChild(),
    GameRoutingModule,
  ],
  declarations: [
    ActivePlayerComponent,
    CellComponent,
    DungeonComponent,
    GameComponent,
    GameOverComponent,
    PlayerSheetComponent,
    PlayerSheetsComponent,
  ],
})
export class GameModule { }
