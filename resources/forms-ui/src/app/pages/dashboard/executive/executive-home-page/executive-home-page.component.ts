import { Component, OnInit } from '@angular/core';
import { toString } from 'lodash';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AccountService } from 'src/app/services/account/account.service';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-executive-home-page',
  templateUrl: './executive-home-page.component.html',
  styleUrls: ['./executive-home-page.component.css']
})
export class ExecutiveHomePageComponent implements OnInit {
  loading: boolean;
  endDate: string;
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
  }

  ngOnInit() {
    // this.getAnalytics();
  }

  initVars() {
    if (window.location.origin == 'http://localhost:4200') {
      this.firstname = this.localStorage.getUser().firstname;
      this.merchantId = toString(this.localStorage.getUser().merchant_id);
    }
    else {
      this.checkAccessToLogin().then(
        res => {
          if (res == 'ok') {
            this.firstname = this.localStorage.getUser().firstname;
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
    this.analyticService.getCompanyUsersCount(this.merchantId).then(
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
