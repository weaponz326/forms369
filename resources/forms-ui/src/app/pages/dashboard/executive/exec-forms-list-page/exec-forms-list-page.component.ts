import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormsService } from 'src/app/services/forms/forms.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { ClientService } from 'src/app/services/client/client.service';
import { Users } from 'src/app/models/users.model';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-exec-forms-list-page',
  templateUrl: './exec-forms-list-page.component.html',
  styleUrls: ['./exec-forms-list-page.component.css']
})
export class ExecFormsListPageComponent implements OnInit {
  user: Users;
  query: string;
  loading: boolean;
  hasData: boolean;
  hasMore: boolean;
  hasError: boolean;
  merchantId: string;
  foundNoForm: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  allFormsList: Array<any>;

  constructor(
    private formService: FormsService,
    private dateService: DateTimeService,
    private clientService: ClientService,
    private companyService: CompanyService,
    private localStorage: LocalStorageService
  ) {
    this.allFormsList = [];
    this.user = this.localStorage.getUser();
    this.getAllCompanyForms();
  }

  ngOnInit() {
  }

  checkIfHasMore() {
    return _.isNull(this.formService.nextPaginationUrl) ? false : true;
  }

  getAllCompanyForms() {
    this.loading = true;
    this.merchantId = this.localStorage.getUser().merchant_id.toString();
    console.log(this.merchantId);
    this.formService.getAllFormsByMerchant(this.merchantId).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.created_at = this.dateService.safeDateFormat(form.created_at);
            this.allFormsList.push(form);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.formService.nextPaginationUrl;
    this.formService.getAllForms(moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const forms = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(forms, (form) => {
          form.created_at = this.dateService.safeDateFormat(form.created_at);
          this.allFormsList.push(form);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  searchByFormCode() {
    this.loading = true;
    this.clientService.findFormsByCode(this.query).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            this.allFormsList.push(form);
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
    this.companyService.findFormsByName(this.query, this.merchantId).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.hasData = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            this.allFormsList.push(form);
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
      if (this.query.length > 0) {
        // we need to know whether the user is searching by a form code
        // or the user is searching by a form name.
        // First, check if its a form code.
        console.log(this.query);
        this.hasError = false;
        this.allFormsList = [];
        if (/\d/.test(this.query)) {
          if (this.query.length == 5) {
            // search by form code, based on the input
            // the user might be searching by a form code.
            console.log('searching by form code');
            this.searchByFormCode();
          }
          else {
            // the input contains a number but is more than 6 characters
            // in lenght, this might be a form name.
            console.log('searching by form name');
            this.searchByFormName();
          }
        }
        else {
          // since all our form codes includes digits, and this
          // users input doesnt include a digit, search by form name.
          console.log('searching by form name last');
          this.searchByFormName();
        }
      }
      else {
        this.hasData = true;
        this.foundNoForm = false;
        this.allFormsList = [];
        this.getAllCompanyForms();
      }
    }
  }

  retry() {
    this.hasError = false;
    this.getAllCompanyForms();
  }
}
