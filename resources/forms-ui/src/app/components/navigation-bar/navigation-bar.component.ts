import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  fullName: string;
  userType: UserTypes;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
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

  confirmLogout() {
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.logout();
        }
      }
    );
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
