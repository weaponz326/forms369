import { toString } from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AccountService } from 'src/app/services/account/account.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-executive-home-page',
  templateUrl: './executive-home-page.component.html',
  styleUrls: ['./executive-home-page.component.css']
})
export class ExecutiveHomePageComponent implements OnInit {
  loading: boolean;
  endDate: string;
  branchId: string;
  startDate: string;
  firstname: string;
  merchantId: string;
  numTotalUsers: string;
  numTotalForms: string;
  numTotalBranches: string;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private analyticService: AnalyticsService,
  ) {
    this.initVars();
    this.setDefaultCounts();
  }

  ngOnInit() {
  }

  initVars() {
    if (window.location.origin == 'http://localhost:4200') {
      this.firstname = this.localStorage.getUser().firstname;
      this.merchantId = toString(this.localStorage.getUser().merchant_id);
      this.getAnalytics();
    }
    else {
      this.checkAccessToLogin().then(
        res => {
          if (res == 'ok') {
            this.firstname = this.localStorage.getUser().firstname;
            this.branchId = toString(this.localStorage.getUser().branch_id);
            this.merchantId = toString(this.localStorage.getUser().merchant_id);
            this.getAnalytics();
          }
          else {
            this.router.navigateByUrl('auth');
          }
        }
      );
    }
  }

  setDefaultCounts() {
    this.numTotalUsers = '0';
    this.numTotalForms = '0';
    this.numTotalBranches = '0';
    this.totalNoSubmitted = '0';
    this.totalNoProcessed = '0';
    this.totalNoProcessing = '0';
  }

  openForms() {
    this.router.navigateByUrl('/executive/forms');
  }

  openProcessed() {
    this.router.navigateByUrl('/executive/processed');
  }

  openProcessing() {
    this.router.navigateByUrl('/executive/processing');
  }

  openSubmitted() {
    this.router.navigateByUrl('/executive/submitted');
  }

  openBranches() {
    this.router.navigateByUrl('/executive/branches');
  }

  openAccounts() {
    this.router.navigateByUrl('/executive/accounts');
  }

  getFormAnalytics() {
    this.analyticService.getCompanyFormCount(this.merchantId).then(
      count => {
        this.numTotalForms = count;
      }
    );
  }

  getBranchAnalytics() {
    this.analyticService.getCompanyBranchCount(this.merchantId).then(
      count => {
        this.numTotalBranches = count;
      }
    );
  }

  getSubmittedFormsAnalytics(id: string) {
    this.analyticService.getFrontDeskSubmittedFormsCount(id).then(
      count => {
        this.totalNoSubmitted = count;
      }
    );
  }

  getProcessedFormsAnalytics(id: string) {
    this.analyticService.getFrontDeskProcessedFormsCount(id).then(
      count => {
        this.totalNoProcessed = count;
      }
    );
  }

  getProcessingFormsAnalytics(id: string) {
    this.analyticService.getFrontDeskProcessingFormsCount(id).then(
      count => {
        this.totalNoProcessing = count;
        this.loading = false;
      }
    );
  }

  getUserAccountsAnalytics() {
    console.log(this.localStorage.getUser().branch_id);
    this.localStorage.getUser().branch_id.toString() == '0'
      ? this.getUsersByMerchantAccountAnalytics()
      : this.getUsersByBranchAccountAnalytics();
  }

  getUsersByMerchantAccountAnalytics() {
    console.log('getting for merchant');
    this.analyticService.getCompanyUsersCount(this.merchantId).then(
      count => {
        this.numTotalUsers = count;
      }
    );
  }

  getUsersByBranchAccountAnalytics() {
    console.log('getting for branch');
    this.analyticService.getBranchUsersCount(this.branchId).then(
      count => {
        this.numTotalUsers = count;
      }
    );
  }

  getAnalytics() {
    this.loading = true;
    this.getFormAnalytics();
    this.getBranchAnalytics();
    this.getUserAccountsAnalytics();
    this.getProcessedFormsAnalytics(this.merchantId);
    this.getSubmittedFormsAnalytics(this.merchantId);
    this.getProcessingFormsAnalytics(this.merchantId);
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
