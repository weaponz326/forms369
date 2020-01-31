import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-home-page',
  templateUrl: './front-desk-home-page.component.html',
  styleUrls: ['./front-desk-home-page.component.css']
})
export class FrontDesktopHomePageComponent implements OnInit {

  user: Users;
  form: FormGroup;
  user_id: string;
  loading: boolean;
  firstname: string;
  submitted: boolean;
  merchant_id: string;
  notValidCode: boolean;
  totalNoSubmitted: string;
  totalNoProcessed: string;
  totalNoProcessing: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private analyticService: AnalyticsService,
    private frontDeskService: FrontDeskService,
  ) {
    this.initVars();
    this.setDefaultCounts();
  }

  ngOnInit() {
    this.setupForm();
  }

  initVars() {
    this.user = this.localStorage.getUser();
    this.firstname = this.user.firstname;
    this.user_id = _.toString(this.user.id);
    this.merchant_id = _.toString(this.user.merchant_id);
    if (window.location.origin == 'http://localhost:4200') {
      // this.user = this.localStorage.getUser();
      // this.firstname = this.user.firstname;
      // this.user_id = _.toString(this.user.id);
      // this.merchant_id = _.toString(this.user.merchant_id);
      this.getFrontDeskAnalytics();
    }
    else {
      this.checkAccessToLogin().then(
        res => {
          if (res == 'ok') {
            // this.user = this.localStorage.getUser();
            // this.firstname = this.user.firstname;
            // this.user_id = _.toString(this.user.id);
            // this.merchant_id = _.toString(this.user.merchant_id);

            this.getFrontDeskAnalytics();
          }
          else {
            this.router.navigateByUrl('auth');
          }
        }
      );
    }
  }

  setDefaultCounts() {
    this.totalNoSubmitted = '0';
    this.totalNoProcessed = '0';
    this.totalNoProcessing = '0';
  }

  public get f() {
    return this.form.controls;
  }

  setupForm() {
    this.form = this.formBuilder.group({
      code: ['', [Validators.minLength(5), Validators.maxLength(5), Validators.required]]
    });
  }

  open(view: string) {
    switch (view) {
      case 'submitted':
        this.router.navigateByUrl('/front_desk/lists/submitted');
        break;
      case 'processed':
        this.router.navigateByUrl('/front_desk/lists/processed');
        break;
      case 'processing':
        this.router.navigateByUrl('/front_desk/lists/processing');
        break;
      default:
        break;
    }
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

  getFrontDeskAnalytics() {
    this.getProcessedFormsAnalytics(this.user_id);
    this.getProcessingFormsAnalytics(this.user_id);
    this.getSubmittedFormsAnalytics(this.merchant_id);
  }

  getSubmittedFormsAnalytics(id: string) {
    this.analyticService.getFrontDeskSubmittedFormsCount(id).then(
      count => {
        this.totalNoSubmitted = count;
      }
    );
  }

  getProcessedFormsAnalytics(id: string) {
    this.analyticService.getProcessedFormsByFrontDeskCount(id).then(
      count => {
        this.totalNoProcessed = count;
      }
    );
  }

  getProcessingFormsAnalytics(id: string) {
    this.analyticService.getProcessingFormsByFrontDeskCount(id).then(
      count => {
        this.totalNoProcessing = count;
      }
    );
  }

  submit() {
    this.submitted = true;
    this.notValidCode = false;
    if (this.form.valid) {
      this.loading = true;
      const code = this.f.code.value;
      const merchant_id = _.toString(this.user.merchant_id);
      this.frontDeskService.getForm(code, merchant_id).then(
        res => {
          if (!_.isEmpty(res)) {
            this.loading = false;
            this.submitted = false;
            this.notValidCode = false;
            this.router.navigateByUrl('/front_desk/view_form', { state: { form: res }});
          }
          else {
            this.loading = false;
            this.submitted = false;
            this.notValidCode = true;
          }
        },
        err => {
          this.loading = false;
          this.submitted = false;
          this.notValidCode = true;
        }
      );
    }
  }

  cancel() {
    this.f.code.setValue('');
  }
}
