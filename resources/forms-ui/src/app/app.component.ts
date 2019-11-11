import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    // this.expireAuthToken();
  }

  expireAuthToken() {
    setInterval(() => {
      console.log('checking if token is expired');
    }, 5000);
  }
}
