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
    // this.getAnalytics();
  }

  openForms() {
    this.router.navigateByUrl('/admin/form_lists');
  }

  getAnalytics() {
    this.loading = true;
    // this.getBranchAnalytics();
    // this.getCompanyAnalytics();
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

}
