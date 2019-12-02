import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-accounts-list-page',
  templateUrl: './exec-accounts-list-page.component.html',
  styleUrls: ['./exec-accounts-list-page.component.css']
})
export class ExecAccountsListPageComponent implements OnInit {
  loading: boolean;
  hasError: boolean;
  hasData: boolean;
  hasMore: boolean;
  merchantId: string;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  userAccounts: Array<any>;
  allUserAccounts: Array<any>;

  constructor(
    private accountService: AccountService,
    private localStorage: LocalStorageService
  ) {
    this.userAccounts = [];
    this.allUserAccounts = [];
    this.merchantId = _.toString(this.localStorage.getUser().merchant_id);
  }

  ngOnInit() {
    this.filterState = 'all';
    this.getUserAccounts();
  }

  showAll() {
    this.filterState = 'all';
    this.userAccounts = this.allUserAccounts;
  }

  showActive() {
    this.filterState = 'active';
    this.userAccounts = _.filter(this.allUserAccounts, (company) => company.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.userAccounts = _.filter(this.allUserAccounts, (company) => company.status == 0);
  }

  getUserAccounts() {
    this.loading = true;
    this.accountService.getAllUsersByMerchant(this.merchantId).then(
      res => {
        const accounts = res as any;
        console.log('git_admin: ' + JSON.stringify(accounts));
        this.loading = false;
        if (accounts.length > 0) {
          this.hasData = true;
          _.forEach(accounts, (admin) => {
            this.userAccounts.push(admin);
          });
          this.allUserAccounts = _.reverse(this.userAccounts);
        }
        else {
          this.hasData = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  loadMore() {}

  sort(sort_category: string) {
    switch (sort_category) {
      case 'email':
        this.sortByEmail();
        break;
      case 'status':
        this.sortByStatus();
        break;
      case 'created':
        this.sortByCreated();
        break;
      case 'merchant':
        this.sortByCompany();
        break;
      case 'username':
        this.sortByUsername();
        break;
      default:
        break;
    }
  }

  sortByEmail() {
    this.userAccounts = _.sortBy(this.userAccounts, (item) => item.email);
  }

  sortByStatus() {
    this.userAccounts = _.sortBy(this.userAccounts, (item) => item.status);
  }

  sortByCreated() {
    this.userAccounts = _.sortBy(this.userAccounts, (item) => item.created_at);
  }

  sortByCompany() {
    this.userAccounts = _.sortBy(this.userAccounts, (item) => item.merchant_name);
  }

  sortByUsername() {
    this.userAccounts = _.sortBy(this.userAccounts, (item) => item.username);
  }

  retry() {
    this.getUserAccounts();
  }

}
