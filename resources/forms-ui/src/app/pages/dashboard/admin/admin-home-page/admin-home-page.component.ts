import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.css']
})
export class AdminHomePageComponent implements OnInit {
  loading: boolean;
  firstName: string;
  numTotalForms: string;
  numTotalBranches: string;
  numTotalAccounts: string;
  merchantIdentifier: number;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private analyticService: AnalyticsService,
    private localStorage: LocalStorageService
  ) {
    this.initVars();
  }

  ngOnInit() {
  }

  initVars() {
    if (window.location.origin == 'http://localhost:4200') {
      this.firstName = this.localStorage.getUser().firstname;
      this.merchantIdentifier = this.localStorage.getUser().merchant_id;
      this.getAnalytics();
    }
    else {
      this.checkAccessToLogin().then(
        res => {
          if (res == 'ok') {
            this.firstName = this.localStorage.getUser().firstname;
            this.merchantIdentifier = this.localStorage.getUser().merchant_id;
            this.getAnalytics();
          }
          else {
            this.router.navigateByUrl('auth');
          }
        }
      );
    }
  }

  openForms() {
    this.router.navigateByUrl('/admin/lists/form');
  }

  openBranches() {
    this.router.navigateByUrl('/admin/lists/branch');
  }

  openAccounts() {
    this.router.navigateByUrl('/admin/lists/accounts');
  }

  getAnalytics() {
    this.loading = true;
    this.getAccountsAnalytics();
    this.getBranchAnalytics();
    this.getFormAnalytics();
  }

  getAccountsAnalytics() {
    this.analyticService.getCompanyUsersCount(this.merchantIdentifier.toString()).then(
      count => {
        this.numTotalAccounts = count;
      }
    );
  }

  getFormAnalytics() {
    this.analyticService.getCompanyFormCount(this.merchantIdentifier.toString()).then(
      count => {
        this.numTotalForms = count;
        this.loading = false;
      }
    );
  }

  getBranchAnalytics() {
    const merchant_id = this.merchantIdentifier.toString();
    this.analyticService.getCompanyBranchCount(merchant_id).then(
      count => {
        this.numTotalBranches = count;
        this.loading = false;
      }
    );
  }

  checkAccessToLogin() {
    return new Promise((resolve, reject) => {
      this.accountService.checkLoginAccess().then(
        res => {
          const response = res as any;
          if (response.message == 'No_access_code') {
            this.router.navigateByUrl('auth');
            resolve('not_ok');
          }
          else if (response.message == 'Re_enter_access_code') {
            this.router.navigateByUrl('auth');
            resolve('not_ok');
          }
          else {
            // the response message is: Access_granted
            // we do nothing, we allow them to see login
            // page and give them access to login.
            resolve('ok');
          }
        },
        err => {}
      );
    });
  }

}
