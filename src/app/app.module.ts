import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameCollection } from './collection/game-collection';
import { GameService } from './service/game.service';
import { GameModule } from 'src/game/game.module';
import { DialogService } from './service/dialog.service';
import { CharacterComponent } from './ui/character/character.component';
import { CharacterCollection } from './collection/character-collection';
import { NewGameSetupComponent } from './ui/new-game-setup/new-game-setup.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO,
    }),
    GameModule,
  ],
  declarations: [
    AppComponent,
    CharacterComponent,
    NewGameSetupComponent,
  ],
  providers: [
    // Services
    DialogService,
    GameService,

    // Collections
    CharacterCollection,
    GameCollection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
