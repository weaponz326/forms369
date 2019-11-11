import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-view-account-details-page',
  templateUrl: './view-account-details-page.component.html',
  styleUrls: ['./view-account-details-page.component.css'],
  providers: [AccountService]
})
export class ViewAccountDetailsPageComponent implements OnInit {

  id: string;
  user: any;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;
  accountType: string;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.id = this.router.getCurrentNavigation().extras.state.id;
    this.getAccountDetails();
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigateByUrl('/git_admin/edit/user_account', { state: { id: id }});
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
