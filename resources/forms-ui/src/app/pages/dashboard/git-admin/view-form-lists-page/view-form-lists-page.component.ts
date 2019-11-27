import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ListViewService } from 'src/app/services/view/list-view.service';

@Component({
  selector: 'app-view-form-lists-page',
  templateUrl: './view-form-lists-page.component.html',
  styleUrls: ['./view-form-lists-page.component.css']
})
export class ViewFormListsPageComponent implements OnInit {

  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  companyId: string;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  formsList: Array<any>;
  allFormsList: Array<any>;

  constructor(
    private router: Router,
    private formService: FormsService,
    private listViewService: ListViewService
  ) {
    this.formsList = [];
    this.allFormsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();

    this.getForms();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  showAll() {
    this.filterState = 'all';
    this.formsList = this.allFormsList;
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
      case 'form':
        this.sortByForm();
        break;
      default:
        break;
    }
  }

  sortByForm() {
    this.formsList = _.sortBy(this.formsList, (item) => item.name);
  }

  sortByCreated() {
    this.formsList = _.sortBy(this.formsList, (item) => item.created_at);
  }

  sortByCompany() {
    this.formsList = _.sortBy(this.formsList, (item) => item.merchant_name);
  }

  showActive() {
    this.filterState = 'active';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 0);
  }

  edit(form: any) {
    this.router.navigateByUrl('git_admin/edit/form', { state: { form: form }});
  }

  view(form: any) {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: form }});
  }

  openNewForm() {
    this.router.navigateByUrl('/git_admin/setup_form');
  }

  delete(id: string) {}

  checkIfHasMore() {
    return _.isNull(this.formService.nextPaginationUrl) ? false : true;
  }

  getForms() {
    if (_.isUndefined(window.history.state.company)) {
      this.getAllForms();
    }
    else {
      this.companyId = window.history.state.company;
      this.getCompanyForms();
    }
  }

  getAllForms() {
    this.loading = true;
    this.formService.getAllForms().then(
      res => {
        const forms = res as any;
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasNoData = false;
          _.forEach(forms, (form) => {
            this.formsList.push(form);
            this.allFormsList = this.formsList;
          });
        }
        else {
          this.hasNoData = true;
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  getCompanyForms() {
    this.loading = true;
    this.formService.getAllFormsByMerchant(this.companyId).then(
      res => {
        const forms = res as any;
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasNoData = false;
          _.forEach(forms, (form) => {
            this.formsList.push(form);
            this.allFormsList = this.formsList;
          });
        }
        else {
          this.hasNoData = true;
        }
        this.loading = false;
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
          this.allFormsList = this.formsList;
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

}
