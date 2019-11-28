import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-executive-home-page',
  templateUrl: './executive-home-page.component.html',
  styleUrls: ['./executive-home-page.component.css']
})
export class ExecutiveHomePageComponent implements OnInit {
  firstname: string;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private analyticService: AnalyticsService,
  ) {
    this.firstname = this.localStorage.getUser().firstname;
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

}
