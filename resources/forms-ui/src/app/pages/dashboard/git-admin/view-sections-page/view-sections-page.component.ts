import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ListViewService } from 'src/app/services/view/list-view.service';

@Component({
  selector: 'app-view-sections-page',
  templateUrl: './view-sections-page.component.html',
  styleUrls: ['./view-sections-page.component.css']
})
export class ViewSectionsPageComponent implements OnInit {
  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  formsList: Array<any>;
  allFormsList: Array<any>;
  activeFormsList: Array<any>;
  inActiveFormsList: Array<any>;

  constructor(
    private router: Router,
    private formService: FormsService,
    private listViewService: ListViewService
  ) {
    this.formsList = [];
    this.allFormsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();

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
    this.formsList = _.filter(this.allFormsList, (form) => form.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.formsList = _.filter(this.allFormsList, (form) => form.status == 0);
  }

  edit(form: any) {
    this.router.navigateByUrl('git_admin/edit/form/' + form.form_code, { state: { form: form } });
  }

  view(form: any) {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: form } });
  }

  openNewForm() {
    this.router.navigateByUrl('/git_admin/setup_form');
  }

  delete(id: string) { }

  getAllForms() {
    this.loading = true;
    this.formService.getAllForms().then(
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

  loadMore() { }

}
