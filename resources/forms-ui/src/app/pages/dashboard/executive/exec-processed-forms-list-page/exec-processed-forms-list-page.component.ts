import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
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
  query: string;
  form: FormGroup;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  submitted: boolean;
  loadingMore: boolean;
  foundNoForm: boolean;
  hasMoreError: boolean;
  processedFormsList: Array<any>;
  allProcessedFormsList: Array<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dateService: DateTimeService,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.query = '';
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
          this.allProcessedFormsList = this.processedFormsList;
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
        this.allProcessedFormsList = this.processedFormsList;
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
    this.frontDeskService.findFormsByCodeAndStatus(this.query, this.user.merchant_id.toString(), 2).then(
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
            this.processedFormsList.push(form);
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
    this.frontDeskService.findFormByNameAndStatus(this.query, this.user.merchant_id.toString(), 2).then(
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
            this.processedFormsList.push(form);
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
        this.processedFormsList = [];
        this.allProcessedFormsList = [];
        if (this.query.length == 5 || this.query.length == 6) {
          // search by submission code.
          console.log('searching by submission code');
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
        this.hasData = true;
        this.foundNoForm = false;
        console.log('hererereererere');
        this.getAllProcessedForms();
      }
    }
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
      const end_date = this.dateService.bootstrapDateFormat(end);
      const start_date = this.dateService.bootstrapDateFormat(start);
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
    this.hasError = false;
    this.getAllProcessedForms();
  }

}
