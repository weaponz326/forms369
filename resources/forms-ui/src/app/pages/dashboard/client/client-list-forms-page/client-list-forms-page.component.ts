import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-client-list-forms-page',
  templateUrl: './client-list-forms-page.component.html',
  styleUrls: ['./client-list-forms-page.component.css']
})
export class ClientListFormsPageComponent implements OnInit {
  company: any;
  query: string;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  foundNoForm: boolean;
  isConnected: boolean;
  formsList: Array<any>;
  loadingMore: boolean;
  hasMoreError: boolean;

  constructor(
    private router: Router,
    private formService: FormsService,
    private clientService: ClientService
  ) {
    this.query = '';
    this.formsList = [];
    this.company = history.state.company;
    this.resolveReloadDataLoss();
    this.isConnected = window.navigator.onLine ? true : false;
    this.getAllForms();
  }

  ngOnInit() {
  }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this.company)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('company', JSON.stringify(this.company));
    }
    else {
      this.company = JSON.parse(sessionStorage.getItem('company'));
    }
  }

  open(form: any) {
    this.router.navigateByUrl('/client/form_entry', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isNull(this.formService.nextPaginationUrl) ? false : true;
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
            this.formsList.push(form);
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
    this.clientService.findFormsByName(this.query).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            this.formsList.push(form);
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
      // we need to know whether the user is searching by a form code
      // or the user is searching by a form name.
      // First, check if its a form code.
      console.log(this.query);
      this.hasError = false;
      this.formsList = [];
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
      if ((this.foundNoForm && this.query.length == 0) || this.query.length == 0) {
        this.hasData = true;
        this.foundNoForm = false;
        console.log('hererereererere');
        this.getAllForms();
      }
    }
  }

  getAllForms() {
    this.loading = true;
    const merchant_id = this.company.id;
    this.formService.getAllFormsByStatusAndMerchant(merchant_id, '1').then(
      res => {
        const forms = res as any;
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.company_name = this.company.merchant_name;
            this.formsList.push(form);
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
          this.formsList.push(form);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getAllForms();
  }

}
