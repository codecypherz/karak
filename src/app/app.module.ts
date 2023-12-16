import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameCollection } from './collection/game-collection';
import { GameService } from './service/game.service';
import { GameModule } from 'src/game/game.module';
import { DialogService } from './service/dialog.service';

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
  ],
  providers: [
    // Services
    DialogService,
    GameService,

    // Collections
    GameCollection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
