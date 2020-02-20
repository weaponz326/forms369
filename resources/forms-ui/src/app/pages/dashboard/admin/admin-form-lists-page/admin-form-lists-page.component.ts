import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-admin-form-lists-page',
  templateUrl: './admin-form-lists-page.component.html',
  styleUrls: ['./admin-form-lists-page.component.css']
})
export class AdminFormListsPageComponent implements OnInit {
  query: string;
  loading: boolean;
  hasMore: boolean;
  viewMode: string;
  hasError: boolean;
  hasNoData: boolean;
  merchant_id: string;
  foundNoForm: boolean;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  formsList: Array<any>;
  isBranchAdmin: boolean;
  allFormsList: Array<any>;
  loadingModalRef: NgbModalRef;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private formService: FormsService,
    private clientService: ClientService,
    private listViewService: ListViewService,
    private localStorage: LocalStorageService
  ) {
    this.query = '';
    this.formsList = [];
    this.allFormsList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.merchant_id = this.localStorage.getUser().merchant_id.toString();
    this.isBranchAdmin = this.localStorage.getUser().usertype == UserTypes.BranchAdmin ? true : false;

    this.getAllForms();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  showLoadingModal() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingModal() {
    this.loadingModalRef.close();
  }

  handleLoadMoreVisibility(list: Array<any>) {
    _.isNull(list) || _.isUndefined(list) || _.isEmpty(list) || list.length < 15 ? this.hasMore = false : this.hasMore = true;
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

  showAll() {
    this.filterState = 'all';
    this.formsList = this.allFormsList;
    const moreUrl = this.formService.nextPaginationUrl;
    _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
  }

  showActive() {
    this.filterState = 'active';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 1);
    this.hasMore ? this.handleLoadMoreVisibility(this.formsList) : null;
  }

  showInActive() {
    this.filterState = 'inactive';
    this.formsList = _.filter(this.allFormsList, (form) =>  form.status == 0);
    this.hasMore ? this.handleLoadMoreVisibility(this.formsList) : null;
  }

  openNewForm() {
    this.router.navigateByUrl('admin/create/form');
  }

  checkIfHasMore() {
    return _.isNull(this.formService.nextPaginationUrl) ? false : true;
  }

  getAllForms() {
    this.loading = true;
    this.formService.getAllFormsByMerchant(this.merchant_id).then(
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
    this.formService.getAllFormsByMerchant(this.merchant_id, moreUrl).then(
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

  edit(ev: Event, form: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('admin/edit/form', { state: { form: form }});
  }

  view(ev: Event, form: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('admin/details/form', { state: { form: form }});
  }

  delete(ev: Event, id: string, index: number) {
    ev.stopPropagation();
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'delete') {
          this.showLoadingModal();
          this.formService.deleteForm(id).then(
            ok => {
              const res = ok as any;
              if (_.toLower(res.message) == 'ok') {
                this.allFormsList.splice(index, 1);
                this.hideLoadingModal();
              }
              else {
                this.hideLoadingModal();
              }
            },
            err => {
              this.hideLoadingModal();
            }
          );
        }
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
      const allForms = this.formsList;
      if (this.query.length != 0) {
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
            // the input contains a number but is more than 5 characters
            // in length, this might be a form name.
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
          this.hasNoData = false;
          this.foundNoForm = false;
          this.formsList = [];
          console.log('hererereererere');
          this.getAllForms();
        }
      }
    }
  }

  retry() {
    this.getAllForms();
  }

}
