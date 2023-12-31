import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router) { }

  navigateHome(): void {
    this.router.navigate(['']);
  }

  getNavigationTitle(): string {
    // This is kind of annoying as there should probably be a reliance
    // on the routing config here, but I don't want to mess with the actual
    // browser title.
    if (this.router.isActive(
        '/game-selection', {
          paths: 'exact',
          queryParams: 'exact',
          fragment: 'ignored',
          matrixParams: 'ignored'
        })) {
      return 'Player Selection';
    }
    return '';
  }
}
