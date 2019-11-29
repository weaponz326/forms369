import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

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
    private analyticService: AnalyticsService,
    private localStorageService: LocalStorageService
  ) {
    this.firstName = this.localStorageService.getUser().firstname;
  }

  ngOnInit() {
    this.getAnalytics();
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

}
