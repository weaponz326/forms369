import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Merchants } from 'src/app/models/merchants.model';
import { ClientService } from 'src/app/services/client/client.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';

@Component({
  selector: 'app-client-form-merchant-page',
  templateUrl: './client-form-merchants-page.component.html',
  styleUrls: ['./client-form-merchants-page.component.css']
})
export class ClientFormMerchantsPageComponent implements OnInit {
  query: string;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasData: boolean;
  foundNoForm: boolean;
  isConnected: boolean;
  formsList: Array<any>;
  loadingMore: boolean;
  hasMoreError: boolean;
  companyList: Array<Merchants>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private companyService: CompanyService,
    private endpointService: EndpointService
  ) {
    this.formsList = [];
    this.companyList = [];
    this.getCompanies();
  }

  ngOnInit() {
    this.isConnected = window.navigator.onLine ? true : false;
  }

  open(company: any) {
    this.router.navigateByUrl('/client/forms', { state: { company: company }});
  }

  openForm(form: any) {
    this.router.navigateByUrl('/client/form_entry', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isNull(this.companyService.nextPaginationUrl) ? false : true;
  }

  getCompanies() {
    this.loading = true;
    this.companyService.getAllCompanies().then(
      res => {
        this.loading = false;
        const merchants = res as any;
        this.hasMore = this.checkIfHasMore();
        if (merchants.length > 0) {
          this.hasData = true;
          _.forEach(merchants, (company) => {
            company.logo = this.endpointService.storageHost + company.logo;
            this.companyList.push(company);
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
    this.hasMoreError = false;
    const moreUrl = this.companyService.nextPaginationUrl;
    this.companyService.getAllCompanies(moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const merchants = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(merchants, (company) => {
          company.logo = this.endpointService.storageHost + company.logo;
          this.companyList.push(company);
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
      this.companyList = [];
      if (/\d/.test(this.query)) {
        if (this.query.length == 6) {
          // search fby form code, based on the input
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
      if (this.foundNoForm && this.query.length == 0) {
        this.hasData = true;
        this.foundNoForm = false;
        console.log('hererer');
        this.getCompanies();
      }
    }
  }

}
