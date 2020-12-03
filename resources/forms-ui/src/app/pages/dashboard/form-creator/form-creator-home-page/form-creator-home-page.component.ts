import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-form-creator-home-page',
  templateUrl: './form-creator-home-page.component.html',
  styleUrls: ['./form-creator-home-page.component.css']
})
export class FormCreatorHomePageComponent implements OnInit {

  loading: boolean;
  firstName: string;
  numTotalForms: string;
  numTotalUsers: string;
  numTotalCompany: string;
  numTotalBranches: string;
  numTotalActiveCompany: string;
  numTotalActiveBranches: string;
  numTotalInActiveCompany: string;
  numTotalInActiveBranches: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private analyticService: AnalyticsService,
    private localStorageService: LocalStorageService
  ) {
    this.initVars();
  }

  ngOnInit() {
    this.getAnalytics();
  }

  initVars() {
    if (window.location.origin != 'http://localhost:4200') {
      this.checkAccessToLogin().then(
        res => {
          res == 'ok'
            ? this.firstName = this.localStorageService.getUser().firstname
            : this.router.navigateByUrl('auth');
        }
      );
    }
    else {
      this.firstName = this.localStorageService.getUser().firstname;
    }
  }

  openCompanies() {
    this.router.navigateByUrl('git_admin/lists/company');
  }

  openBranches() {
    this.router.navigateByUrl('git_admin/lists/branch');
  }

  openForms() {
    this.router.navigateByUrl('git_admin/lists/form');
  }

  getAccountsAnalytics() {
    this.analyticService.getAllUsersCount().then(
      count => {
        this.numTotalUsers = count;
      }
    );
  }

  getBranchAnalytics() {
    this.analyticService.getBranchCount().then(
      count => {
        this.numTotalBranches = count;
      }
    );

    this.analyticService.getActiveBranchCount().then(
      count => {
        this.numTotalActiveBranches = count;
      }
    );

    this.analyticService.getInactiveBranchCount().then(
      count => {
        this.numTotalInActiveBranches = count;
      }
    );
  }

  getCompanyAnalytics() {
    this.analyticService.getCompanyCount().then(
      count => {
        this.numTotalCompany = count;
      }
    );

    this.analyticService.getActiveCompanyCount().then(
      count => {
        this.numTotalActiveCompany = count;
      }
    );

    this.analyticService.getInactiveCompanyCount().then(
      count => {
        this.numTotalInActiveCompany = count;
      }
    );
  }

  getFormAnalytics() {
    this.analyticService.getAllFormsCount().then(
      count => {
        this.numTotalForms = count;
        this.loading = false;
      }
    );
  }

  getAnalytics() {
    this.loading = true;
    this.getBranchAnalytics();
    this.getCompanyAnalytics();
    this.getAccountsAnalytics();
    this.getFormAnalytics();
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
        err => { }
      );
    });
  }

}