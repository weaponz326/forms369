import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-exec-view-account-details-page',
  templateUrl: './exec-view-account-details-page.component.html',
  styleUrls: ['./exec-view-account-details-page.component.css']
})
export class ExecViewAccountDetailsPageComponent implements OnInit {
  user: any;
  id: string;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;
  accountType: string;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.id = window.history.state.id;
    this.resolveReloadDataLoss();
    this.getAccountDetails();
  }

  ngOnInit() {
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

  edit(id: string) {
    this.router.navigateByUrl('admin/edit/account', { state: { id: id } });
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