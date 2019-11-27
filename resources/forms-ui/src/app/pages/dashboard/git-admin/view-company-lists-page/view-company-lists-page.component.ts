import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Merchants } from 'src/app/models/merchants.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ListViewService } from 'src/app/services/view/list-view.service';

@Component({
  selector: 'app-view-company-lists-page',
  templateUrl: './view-company-lists-page.component.html',
  styleUrls: ['./view-company-lists-page.component.css'],
  providers: [CompanyService, EndpointService]
})
export class ViewCompanyListsPageComponent implements OnInit {

  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  companyList: Array<Merchants>;
  allCompanyList: Array<Merchants>;
  activeCompanyList: Array<Merchants>;
  inActiveCompanyList: Array<Merchants>;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private endpointService: EndpointService,
    private listViewService: ListViewService
  ) {
    this.companyList = [];
    this.allCompanyList = [];
    this.activeCompanyList = [];
    this.inActiveCompanyList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();

    this.getCompanies();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  toggleViewMode(mode: string) {
    switch (mode) {
      case 'list':
        this.viewMode = 'list';
        this.listViewService.setDesiredViewMode('list');
        break;
      case 'grid':
        this.viewMode = 'grid';
        this.listViewService.setDesiredViewMode('grid');
        break;
      default:
        break;
    }
  }

  sort(sort_category: string) {
    switch (sort_category) {
      case 'created':
        this.sortByCreated();
        break;
      case 'merchant':
        this.sortByCompany();
        break;
      default:
        break;
    }
  }

  sortByCreated() {
    this.companyList = _.sortBy(this.companyList, (item) => item.created_at);
  }

  sortByCompany() {
    this.companyList = _.sortBy(this.companyList, (item) => item.merchant_name);
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

  openNewCompany() {
    this.router.navigateByUrl('/git_admin/create/company');
  }

  edit(company: any) {
    this.router.navigateByUrl('/git_admin/edit/company/' + company.id, { state: { company: company }});
  }

  view(company: any) {
    this.router.navigateByUrl('/git_admin/details/company', { state: { company: company }});
  }

  delete(id: string) {}

  checkIfHasMore() {
    return _.isEmpty(this.companyService.nextPaginationUrl) ? false : true;
  }

  getCompanies() {
    this.loading = true;
    this.companyService.getAllCompanies().then(
      res => {
        this.loading = false;
        const merchants = res as any;
        this.hasMore = this.checkIfHasMore();
        if (merchants.length > 0) {
          this.hasNoData = false;
          _.forEach(merchants, (company) => {
            company.logo = this.endpointService.storageHost + company.logo;
            this.companyList.push(company);
            this.allCompanyList = _.reverse(this.companyList);
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

  loadMore() {
    this.loadingMore = true;
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
          this.allCompanyList = _.reverse(this.companyList);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

}
