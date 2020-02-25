import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-view-account-details-page',
  templateUrl: './admin-view-account-details-page.component.html',
  styleUrls: ['./admin-view-account-details-page.component.css'],
  providers: [AccountService]
})
export class AdminViewAccountDetailsPageComponent implements OnInit {

  user: any;
  id: string;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;
  accountType: string;
  user_type: any;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
  ) {
    this.id = window.history.state.id;
    this.resolveReloadDataLoss();
    this.getAccountDetails();
    this.user_type = this.localStorage.getUser().usertype;
    console.log('logged in user type: ' + this.user_type);
  }

  resolveReloadDataLoss() {
    if (!_.isUndefined(this.id)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_id', this.id);
      this.id = sessionStorage.getItem('u_id');
    }
    else {
      this.id = sessionStorage.getItem('u_id');
    }
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigateByUrl('admin/edit/account', { state: { id: id }});
  }

  accountActivation() {
    this.isActive ? this.disableAccount() : this.enableAccount();
  }

  enableAccount() {
    this._loading = true;
    this.accountService.enableAccount(this.id).then(
      res => {
        this.isActive = true;
        this._loading = false;
      },
      err => {
        this._loading = false;
      }
    );
  }

  disableAccount() {
    this._loading = true;
    this.accountService.disableAccount(this.id).then(
      res => {
        this.isActive = false;
        this._loading = false;
      },
      err => {
        this._loading = false;
      }
    );
  }

  getAccountDetails() {
    this.loading = true;
    this.accountService.getAccount(this.id).then(
      account => {
        this.user = account;
        console.log('user___: ' + JSON.stringify(this.user));
        this.isActive = this.user.status == 1 ? true : false;
        this.accountType = this.accountService.getAccountType(this.user.user_type.toString());
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

}
