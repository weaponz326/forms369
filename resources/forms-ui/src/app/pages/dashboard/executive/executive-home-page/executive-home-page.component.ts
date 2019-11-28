import { Component, OnInit } from '@angular/core';
import { toString } from 'lodash';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-executive-home-page',
  templateUrl: './executive-home-page.component.html',
  styleUrls: ['./executive-home-page.component.css']
})
export class ExecutiveHomePageComponent implements OnInit {
  loading: boolean;
  firstname: string;
  merchantId: string;
  numTotalForms: string;
  numTotalCompany: string;
  numTotalBranches: string;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;
  numTotalActiveCompany: string;
  numTotalActiveBranches: string;
  numTotalInActiveCompany: string;
  numTotalInActiveBranches: string;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private analyticService: AnalyticsService,
  ) {
    this.firstname = this.localStorage.getUser().firstname;
    this.merchantId = toString(this.localStorage.getUser().merchant_id);
  }

  ngOnInit() {
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
    this.analyticService.getAllFormsCount().then(
      count => {
        this.numTotalForms = count;
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

  getAnalytics() {
    this.loading = true;
    this.getFormAnalytics();
    this.getBranchAnalytics();
    this.getProcessedFormsAnalytics(this.merchantId);
    this.getSubmittedFormsAnalytics(this.merchantId);
    this.getProcessingFormsAnalytics(this.merchantId);
  }

}
