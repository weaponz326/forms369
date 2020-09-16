import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-rejected-forms-list-page',
  templateUrl: './exec-rejected-forms-list-page.component.html',
  styleUrls: ['./exec-rejected-forms-list-page.component.css']
})
export class ExecRejectedFormsListPageComponent implements OnInit {
  user: Users;
  query: string;
  form: FormGroup;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  showTable: boolean;
  submitted: boolean;
  loadingMore: boolean;
  foundNoForm: boolean;
  hasMoreError: boolean;
  rejectionNote: string;
  chartData: Array<any>;
  loadingReview: boolean;
  isPie: boolean;
  isPieGrid: boolean;
  isVertical: boolean;
  isHorizontal: boolean;
  rejectedFormsList: Array<any>;
  allRejectedFormsList: Array<any>;
  @ViewChild('review', { static: false }) reviewDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dateService: DateTimeService,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.query = '';
    this.chartData = [];
    this.isPie = false;
    this.showTable = true;
    this.isPieGrid = false;
    this.isVertical = true;
    this.isHorizontal = false;
    this.rejectedFormsList = [];
    this.allRejectedFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllRejectedForms();
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
    this.router.navigateByUrl('front_desk/print_form', { state: { form: form } });
  }

  showChart() {
    this.showTable = !this.showTable;
  }

  showPieGrid() {
    this.isPie = false;
    this.isVertical = false;
    this.isHorizontal = false;
    this.isPieGrid = true;
  }

  showPieChart() {
    this.isPieGrid = false;
    this.isVertical = false;
    this.isHorizontal = false;
    this.isPie = true;
  }

  showVerticalChart() {
    this.isPie = false;
    this.isPieGrid = false;
    this.isHorizontal = false;
    this.isVertical = true;
  }

  showHorizontalChart() {
    this.isPie = false;
    this.isPieGrid = false;
    this.isVertical = false;
    this.isHorizontal = true;
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  viewMessage(e: Event, submission_code: string) {
    e.stopPropagation();
    this.modalService.open(this.reviewDialog, { centered: true });
    this.loadingReview = true;
    this.clientService.getRejectionReview(submission_code).then(
      res => {
        console.log('ressss: ' + res);
        this.loadingReview = false;
        this.rejectionNote = res.review;
      },
      err => {
        console.log('error: ' + err);
        this.loadingReview = false;
      }
    );
  }

  getAllRejectedForms() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(3, merchant_id).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            form.last_processed = this.dateService.safeDateFormat(form.last_processed);
            this.rejectedFormsList.push(form);
          });
          this.allRejectedFormsList = this.rejectedFormsList;
          this.loading = false;

          this.generateChartData();
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
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(3, merchant_id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          form.last_processed = this.dateService.safeDateFormat(form.last_processed);
          this.rejectedFormsList.push(form);
        });
        this.allRejectedFormsList = this.rejectedFormsList;
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  searchByFormCode() {
    this.loading = true;
    this.frontDeskService.findFormsByCodeAndStatus(this.query, this.user.merchant_id.toString(), 3).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.hasData = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          console.log('forrrrrm: ' + JSON.stringify(forms));
          _.forEach(forms, (form) => {
            this.rejectedFormsList.push(form);
          });
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  searchByFormName() {
    this.loading = true;
    this.frontDeskService.findFormByNameAndStatus(this.query, this.user.merchant_id.toString(), 3).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.hasData = false;
          this.foundNoForm = true;
        }
        else {
          this.hasData = true;
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            this.rejectedFormsList.push(form);
          });
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  search(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      this.hasMore = false;
      if (this.query.length != 0) {
        // we need to know whether the user is searching by a submission
        // code or by a form name. So first, check if its a submission code.
        console.log(this.query);
        this.hasError = false;
        this.rejectedFormsList = [];
        this.allRejectedFormsList = [];
        if (this.query.length == 6) {
          // search by form code.
          console.log('searching by form code');
          this.searchByFormCode();
        }
        else {
          // search by form name.
          console.log('searching by form name');
          this.searchByFormName();
        }
      }
      else {
        console.log('resetting ...');
        if ((this.foundNoForm && this.query.length == 0) || this.query.length == 0) {
          this.hasData = true;
          this.foundNoForm = false;
          console.log('hererereererere');
          this.getAllRejectedForms();
        }
      }
    }
  }

  filter() {
    this.submitted = true;
    this.rejectedFormsList = this.allRejectedFormsList;
    console.log('processlist length: ' + this.rejectedFormsList.length);
    if (this.form.invalid) {
      console.log('filter form error: ' + this.form.errors);
    }
    else {
      const end = this.f.endDate.value;
      const start = this.f.startDate.value;

      // Bootstrap date picker returns single digit for months from Jan to Sept
      // In order to allow us to compare against MYSQL which returns double digits
      // for that, we convert the month accordingly.
      const end_date = this.dateService.bootstrapDateFormat(end);
      const start_date = this.dateService.bootstrapDateFormat(start);
      console.log(start_date);
      console.log(end_date);

      // Filter forms list.
      this.rejectedFormsList = _.filter(this.rejectedFormsList,
        (form) =>
          this.dateService.getDatePart(form.last_processed) >= start_date &&
          this.dateService.getDatePart(form.last_processed) <= end_date
      );

      this.generateChartDataByDate();
    }
  }

  generateChartData() {
    // We generate the Chart based on the form processed and its count.
    const chart_data = [];
    const found_form = [...new Set(this.allRejectedFormsList.map(form => form.form_name))];
    console.log('found_form: ' + JSON.stringify(found_form));

    _.forEach(found_form, (form) => {
      const count = _.filter(this.allRejectedFormsList, (f) => f.form_name == form);
      chart_data.push({
        name: form,
        value: count.length
      });
    });

    this.chartData = chart_data;
    console.log('____chart_data: ' + JSON.stringify(chart_data));
  }

  generateChartDataByDate() {
    // We generate the Chart based on the form processed and its count
    // only based on the start and end date selected by the user.
    const chart_data = [];
    const end = this.f.endDate.value;
    const start = this.f.startDate.value;

    // Bootstrap date picker returns single digit for months from Jan to Sept
    // In order to allow us to compare against MYSQL which returns double digits
    // for that, we convert the month accordingly.
    const end_date = this.dateService.bootstrapDateFormat(end);
    const start_date = this.dateService.bootstrapDateFormat(start);

    const found_form = [...new Set(this.allRejectedFormsList.map(form => form.form_name))];
    console.log('found_form: ' + JSON.stringify(found_form));

    _.forEach(found_form, (form) => {
      const count = _.filter(
        this.allRejectedFormsList,
        (f) => f.form_name == form &&
          (this.dateService.getDatePart(form.submitted_at) >= start_date &&
            this.dateService.getDatePart(form.submitted_at) <= end_date)
      );
      chart_data.push({
        name: form,
        value: count.length
      });
    });

    this.chartData = chart_data;
    console.log('____chart_data: ' + JSON.stringify(chart_data));
  }

  retry() {
    this.hasError = false;
    this.getAllRejectedForms();
  }

}
