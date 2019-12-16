import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _router: Router) {
    this._router.events.pipe(
      filter(e => e instanceof NavigationStart),
      filter((e: NavigationStart) => e.navigationTrigger == 'popstate')
    )
    .subscribe((x: NavigationStart) => {
      this._router.getCurrentNavigation().extras.state = { ...x.restoredState, navigationId: x.id };
    });
  }
}
