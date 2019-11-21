import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormsService } from 'src/app/services/forms/forms.service';

@Component({
  selector: 'app-admin-form-lists-page',
  templateUrl: './admin-form-lists-page.component.html',
  styleUrls: ['./admin-form-lists-page.component.css']
})
export class AdminFormListsPageComponent implements OnInit {
  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  merchant_id: string;
  filterState: string;
  formsList: Array<any>;
  allFormsList: Array<any>;

  constructor(
    private router: Router,
    private formService: FormsService,
    private listViewService: ListViewService,
    private localStorage: LocalStorageService,
    private formBuilderService: FormBuilderService
  ) {
    this.formsList = [];
    this.allFormsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.merchant_id = this.localStorage.getUser().merchant_id.toString();

    this.getAllForms();
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

  showActive() {
    this.filterState = 'active';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 0);
  }

  openNewForm() {
    this.router.navigateByUrl('admin/create/form');
  }

  getAllForms() {
    this.loading = true;
    this.formService.getAllFormsByMerchant(this.merchant_id).then(
      res => {
        const forms = res as any;
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

  loadMore() {}

  edit(form: any) {
    this.router.navigateByUrl('admin/edit/form', { state: { form: form }});
  }

  view(form: any) {
    this.router.navigateByUrl('admin/details/form', { state: { form: form }});
  }

  delete(id: string) {}

}
