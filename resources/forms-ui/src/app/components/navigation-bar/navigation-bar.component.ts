import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  fullName: string;
  userType: UserTypes;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorage: LocalStorageService
  ) {
    this.userType = this.localStorage.getUser().usertype;
    const lastName = this.localStorage.getUser().lastname;
    const firstName = this.localStorage.getUser().firstname;
    this.fullName = firstName + ' ' + lastName;
  }

  ngOnInit() {
  }

  openHome() {
    this.router.navigateByUrl('user_auth');
  }

  openClientHome() {
    this.router.navigateByUrl('login');
  }

  logout() {
    this.accountService.logOut().then(
      res => {
        console.log('logged out');
        this.userType == UserTypes.Client
          ? this.openClientHome() : this.openHome();
      },
      err => {
        this.userType == UserTypes.Client
          ? this.openClientHome() : this.openHome();
      }
    );
  }

}
