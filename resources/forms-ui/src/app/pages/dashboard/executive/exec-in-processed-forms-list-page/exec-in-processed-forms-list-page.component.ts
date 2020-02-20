import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-in-processed-forms-list-page',
  templateUrl: './exec-in-processed-forms-list-page.component.html',
  styleUrls: ['./exec-in-processed-forms-list-page.component.css']
})
export class ExecInProcessedFormsListPageComponent implements OnInit {
  user: Users;
  form: FormGroup;
  hasData: boolean;
  hasMore: boolean;
  loading: boolean;
  hasError: boolean;
  submitted: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  processingFormsList: Array<any>;
  allProcessingFormsList: Array<any>;

  constructor(
    private fb: FormBuilder,
    private dateService: DateTimeService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processingFormsList = [];
    this.allProcessingFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllFormsInProcessing();
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

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getAllFormsInProcessing() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.processingFormsList.push(form);
          });
          this.allProcessingFormsList = this.processingFormsList;
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
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          this.processingFormsList.push(form);
        });
        this.allProcessingFormsList = this.processingFormsList;
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
    this.processingFormsList = this.allProcessingFormsList;
    console.log('processlist length: ' + this.processingFormsList.length);
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
      this.processingFormsList = _.filter(this.processingFormsList,
        (form) =>
          this.dateService.getDatePart(form.submitted_at) >= start_date &&
          this.dateService.getDatePart(form.submitted_at) <= end_date
      );
    }
  }

  retry() {
    this.getAllFormsInProcessing();
  }

}
