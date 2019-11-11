import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  fullName: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorageService: LocalStorageService
  ) {
    const firstName = this.localStorageService.getUser().firstname;
    const lastName = this.localStorageService.getUser().lastname;
    this.fullName = firstName + ' ' + lastName;
  }

  ngOnInit() {
  }

  openHome() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }

  logout() {
    this.accountService.logOut().then(
      res => {
        this.openHome();
      },
      err => {
        this.openHome();
      }
    );
  }

}
