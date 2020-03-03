import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-client-forms-page',
  templateUrl: './exec-client-forms-page.component.html',
  styleUrls: ['./exec-client-forms-page.component.css']
})
export class ExecClientFormsPageComponent implements OnInit {
  user: Users;
  query: string;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  can_print: boolean;
  foundNoForm: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  allFormsList: Array<any>;

  constructor(
    private router: Router,
    private formsService: FormsService,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
  ) {
    this.allFormsList = [];
    this.user = this.localStorage.getUser();
    this.getAllMerchantForms();
  }

  ngOnInit() {
  }

  open(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/executive/clients_form_data', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isEmpty(this.formsService.nextPaginationUrl) ? false : true;
  }

  getAllMerchantForms() {
    this.loading = true;
    this.formsService.getAllFormsByMerchant(this.user.merchant_id.toString()).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            this.allFormsList.push(form);
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
    const moreUrl = this.formsService.nextPaginationUrl;
    this.formsService.getAllFormsByMerchant(this.user.merchant_id.toString(), moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          this.allFormsList.push(form);
        });
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
    this.clientService.findFormsByName(this.query, this.user.country).then(
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
          if (this.query.length == 5 || this.query.length == 5) {
            // search by form code, based on the input
            // the user might be searching by a form code.
            console.log('searching by form code');
            this.searchByFormCode();
          }
        }
        else {
          // the input contains a number but is more than 6 characters
          // in length, this might be a form name.
          console.log('searching by form name');
          this.searchByFormName();
        }
      }
      else {
        this.hasData = true;
        this.foundNoForm = false;
        this.allFormsList = [];
        console.log('hererereererere');
        this.getAllMerchantForms();
      }
    }
  }

  retry() {
    this.getAllMerchantForms();
  }

}
