import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { Users } from 'src/app/models/users.model';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-front-desk-home-page',
  templateUrl: './front-desk-home-page.component.html',
  styleUrls: ['./front-desk-home-page.component.css']
})
export class FrontDesktopHomePageComponent implements OnInit {

  user: Users;
  form: FormGroup;
  loading: boolean;
  firstname: string;
  submitted: boolean;
  notValidCode: boolean;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private analyticService: AnalyticsService,
    private frontDeskService: FrontDeskService,
  ) {
    this.user = this.localStorage.getUser();
    this.firstname = this.user.firstname;
    const merchant_id = _.toString(this.user.merchant_id);

    this.getFrontDeskAnalytics(merchant_id);
  }

  ngOnInit() {
    this.setupForm();
  }

  public get f() {
    return this.form.controls;
  }

  setupForm() {
    this.form = this.formBuilder.group({
      code: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.required]]
    });
  }

  getFrontDeskAnalytics(id: string) {
    this.getProcessedFormsAnalytics(id);
    this.getSubmittedFormsAnalytics(id);
    this.getProcessingFormsAnalytics(id);
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
      }
    );
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      const code = this.f.code.value;
      this.frontDeskService.getForm(code).then(
        res => {
          if (!_.isEmpty(res)) {
            this.loading = false;
            this.notValidCode = false;
            this.router.navigateByUrl('/front_desk/view_form', { state: { form: res }});
          }
          else {
            this.loading = false;
            this.notValidCode = true;
          }
        },
        err => {
          this.loading = false;
          this.notValidCode = true;
        }
      );
    }
  }

  cancel() {
    this.f.code.setValue('');
  }
}
