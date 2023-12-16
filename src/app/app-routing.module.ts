import { Injectable, NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { PreloadAllModules, RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from "@angular/router";
import { PlayerSelectionComponent } from "./ui/player-selection/player-selection.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PlayerSelectionComponent,
  },
  {
    path: 'game',
    loadChildren: () => import('../game/game.module').then(m => m.GameModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined && title.length > 0) {
      this.title.setTitle(`Karak | ${title}`);
    } else {
      this.title.setTitle(`Karak`);
    }
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
        //enableTracing: true,
      })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
  ],
})
export class AppRoutingModule { }