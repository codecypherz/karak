import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoggerModule } from 'ngx-logger';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game/game.component';

@NgModule({
  imports: [
    CommonModule,
    LoggerModule.forChild(),
    GameRoutingModule,
  ],
  declarations: [
    GameComponent,
  ],
})
export class GameModule { }
