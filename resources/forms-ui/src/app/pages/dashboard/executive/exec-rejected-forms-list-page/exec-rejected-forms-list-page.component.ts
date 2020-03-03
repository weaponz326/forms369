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
  submitted: boolean;
  loadingMore: boolean;
  foundNoForm: boolean;
  loadingReview: boolean;
  hasMoreError: boolean;
  rejectionNote: string;
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
      const end_day = _.toNumber(end.day) <= 9 ? '0' + end.day : end.day;
      const end_month = _.toNumber(end.month) <= 9 ? '0' + end.month : end.month;
      const start_day = _.toNumber(start.day) <= 9 ? '0' + start.day : start.day;
      const start_month = _.toNumber(start.month) <= 9 ? '0' + start.month : start.month;

      const end_date = end.year + '-' + end_month + '-' + end_day;
      const start_date = start.year + '-' + start_month + '-' + start_day;
      console.log(start_date);
      console.log(end_date);

      // Filter forms list.
      this.rejectedFormsList = _.filter(this.rejectedFormsList,
        (form) =>
          this.dateService.getDatePart(form.last_processed) >= start_date &&
          this.dateService.getDatePart(form.last_processed) <= end_date
      );
    }
  }

  retry() {
    this.hasError = false;
    this.getAllRejectedForms();
  }

}
