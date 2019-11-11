import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Merchants } from 'src/app/models/merchants.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';

@Component({
  selector: 'app-view-company-lists-page',
  templateUrl: './view-company-lists-page.component.html',
  styleUrls: ['./view-company-lists-page.component.css'],
  providers: [CompanyService, EndpointService]
})
export class ViewCompanyListsPageComponent implements OnInit {

  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  companyList: Array<Merchants>;
  allCompanyList: Array<Merchants>;
  activeCompanyList: Array<Merchants>;
  inActiveCompanyList: Array<Merchants>;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private endpointService: EndpointService
  ) {
    this.companyList = [];
    this.allCompanyList = [];
    this.activeCompanyList = [];
    this.inActiveCompanyList = [];

    this.getCompanies();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  showAll() {
    this.filterState = 'all';
    this.companyList = this.allCompanyList;
  }

  showActive() {
    this.filterState = 'active';
    this.companyList = _.filter(this.allCompanyList, (company) => company.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.companyList = _.filter(this.allCompanyList, (company) => company.status == 0);
  }

  openBranch(company: any) {
    this.router.navigateByUrl('/git_admin/lists/branch', { state: { company: company }});
  }

  edit(company: any) {
    this.router.navigateByUrl('/git_admin/edit/company/' + company.id, { state: { company: company }});
  }

  view(company: any) {
    this.router.navigateByUrl('/git_admin/details/company', { state: { company: company }});
  }

  delete(id: string) {}

  getCompanies() {
    this.loading = true;
    this.companyService.getAllCompanies().then(
      res => {
        this.loading = false;
        const merchants = res as any;
        if (merchants.length > 0) {
          this.hasNoData = false;
          _.forEach(merchants, (company) => {
            company.logo = this.endpointService.storageHost + company.logo;
            this.companyList.push(company);
            this.allCompanyList = this.companyList;
          });
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

}
