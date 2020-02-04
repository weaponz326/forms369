import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Users } from 'src/app/models/users.model';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-client-home-page',
  templateUrl: './client-home-page.component.html',
  styleUrls: ['./client-home-page.component.css']
})
export class ClientHomePageComponent implements OnInit {

  user: Users;
  firstname: string;
  totalNoRejected: string;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;

  constructor(
    private router: Router,
    private analytics: AnalyticsService,
    private localStorage: LocalStorageService
  ) {
    this.setDefaultCount();
    this.user = this.localStorage.getUser();
    this.firstname = this.user.firstname;
  }

  ngOnInit() {
    this.getClientAnalytics();
  }

  setDefaultCount() {
    this.totalNoRejected = '0';
    this.totalNoProcessed = '0';
    this.totalNoSubmitted = '0';
    this.totalNoProcessing = '0';
  }

  openFormsData() {
    this.router.navigateByUrl('/client/profile');
  }

  openFormsFilled() {
    this.router.navigateByUrl('/client/forms_filled');
  }

  getClientAnalytics() {
    const user_id = this.user.id.toString();
    this.getRejectedFormsAnalytics(user_id);
    this.getProcessedFormsAnalytics(user_id);
    this.getSubmittedFormsAnalytics(user_id);
    this.getProcessingFormsAnalytics(user_id);
  }

  getRejectedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 3).then(
      count => {
        this.totalNoRejected = count;
      }
    );
  }

  getProcessedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 2).then(
      count => {
        this.totalNoProcessed = count;
      }
    );
  }

  getProcessingFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 1).then(
      count => {
        this.totalNoProcessing = count;
      }
    );
  }

  getSubmittedFormsAnalytics(id: string) {
    this.analytics.getClientFormsCount(id, 0).then(
      count => {
        this.totalNoSubmitted = count;
      }
    );
  }

}
