import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

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
    private analyticService: AnalyticsService,
    private localStorage: LocalStorageService
  ) {
    this.firstName = this.localStorage.getUser().firstname;
    this.merchantIdentifier = this.localStorage.getUser().merchant_id;
  }

  ngOnInit() {
    this.getAnalytics();
  }

  openForms() {
    this.router.navigateByUrl('/admin/form_lists');
  }

  getAnalytics() {
    this.loading = true;
    this.getBranchAnalytics();
    this.getFormAnalytics();
  }

  getFormAnalytics() {
    this.analyticService.getAllFormsCount().then(
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

}
