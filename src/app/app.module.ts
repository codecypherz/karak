import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameCollection } from './collection/game-collection';
import { GameService } from './service/game.service';
import { GameModule } from 'src/game/game.module';
import { DialogService } from './service/dialog.service';
import { NewGameSetupComponent } from './ui/new-game-setup/new-game-setup.component';
import { PlayerService } from './service/player.service';
import { PlayableCharacterComponent } from './ui/playable-character/playable-character.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO,
    }),
    GameModule,
  ],
  declarations: [
    AppComponent,
    NewGameSetupComponent,
    PlayableCharacterComponent,
  ],
  providers: [
    // Services
    DialogService,
    GameService,
    PlayerService,

    // Collections
    GameCollection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
