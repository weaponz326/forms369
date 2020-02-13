import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-processed-forms-list-page',
  templateUrl: './exec-processed-forms-list-page.component.html',
  styleUrls: ['./exec-processed-forms-list-page.component.css']
})
export class ExecProcessedFormsListPageComponent implements OnInit {
  user: Users;
  form: FormGroup;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  submitted: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  processedFormsList: Array<any>;
  allProcessedFormsList: Array<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dateService: DateTimeService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processedFormsList = [];
    this.allProcessedFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllProcessedForms();
  }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.fb.group({
      endDate: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  print(ev: Event, form: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('front_desk/print_form', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getAllProcessedForms() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(2, merchant_id).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            form.last_processed = this.dateService.safeDateFormat(form.last_processed);
            this.processedFormsList.push(form);
          });
          this.loading = false;
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const merchant_id = this.user.merchant_id.toString();
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(2, merchant_id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          form.last_processed = this.dateService.safeDateFormat(form.last_processed);
          this.processedFormsList.push(form);
        });
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  filter() {
    this.submitted = true;
    this.processedFormsList = this.allProcessedFormsList;
    console.log('processlist length: ' + this.processedFormsList.length);
    if (this.form.invalid) {
      console.log('filter form error: ' + this.form.errors);
    }
    else {
      const end = this.f.endDate.value;
      const start = this.f.startDate.value;

      // Bootstrap date picker returns single digit for months from Jan to Sept
      // In order to allow us to compare against MYSQL which returns double digits
      // for that, we convert the month accordingly.
      const end_month = _.toNumber(end.month) <= 9 ? '0' + end.month : end.month;
      const start_month = _.toNumber(start.month) <= 9 ? '0' + start.month : start.month;

      const end_date = end.year + '-' + end_month + '-' + end.day;
      const start_date = start.year + '-' + start_month + '-' + start.day;
      console.log(start_date);
      console.log(end_date);

      // Filter forms list.
      this.processedFormsList = _.filter(this.processedFormsList,
        (form) =>
          this.dateService.getDatePart(form.last_processed) >= start_date &&
          this.dateService.getDatePart(form.last_processed) <= end_date
      );
    }
  }

  retry() {
    this.getAllProcessedForms();
  }

}
