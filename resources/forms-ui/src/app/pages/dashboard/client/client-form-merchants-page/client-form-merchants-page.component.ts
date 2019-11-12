import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Merchants } from 'src/app/models/merchants.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';

@Component({
  selector: 'app-client-form-merchant-page',
  templateUrl: './client-form-merchants-page.component.html',
  styleUrls: ['./client-form-merchants-page.component.css']
})
export class ClientFormMerchantsPageComponent implements OnInit {

  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasData: boolean;
  isConnected: boolean;
  companyList: Array<Merchants>;
  constructor(
    private router: Router,
    private companyService: CompanyService,
    private endpointService: EndpointService
  ) {
    this.companyList = [];
    this.getCompanies();
  }

  ngOnInit() {
    this.isConnected = window.navigator.onLine ? true : false;
  }

  open(company: any) {
    this.router.navigateByUrl('/client/forms/' + company.id, { state: { company: company }});
  }

  getCompanies() {
    this.loading = true;
    this.companyService.getAllCompanies().then(
      res => {
        this.loading = false;
        const merchants = res as any;
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

}
