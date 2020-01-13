import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-unsent-forms-page',
  templateUrl: './client-unsent-forms-page.component.html',
  styleUrls: ['./client-unsent-forms-page.component.css']
})
export class ClientUnsentFormsPageComponent implements OnInit {

  user: Users;
  hasData: boolean;
  hasMore: boolean;
  loading: boolean;
  hasError: boolean;
  filterState: string;
  isConnected: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  submittedFormsList: Array<any>;
  allSubmittedFormsList: Array<any>;
  processedSubmittedFormsList: Array<any>;
  processingSubmittedFormsList: Array<any>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorage: LocalStorageService
  ) {
    this.submittedFormsList = [];
    this.allSubmittedFormsList = [];
    this.processedSubmittedFormsList = [];
    this.processingSubmittedFormsList = [];
    this.user = this.localStorage.getUser();
    this.isConnected = window.navigator.onLine ? true : false;
  }

  ngOnInit() {
    this.filterState = 'all';
    this.getAllUnsentForms();
  }

  showAll() {
    this.filterState = 'all';
    this.submittedFormsList =  this.allSubmittedFormsList;
  }

  showProcessed() {
    this.filterState = 'processed';
    this.submittedFormsList = _.filter(this.allSubmittedFormsList, (history) => history.form_status == 2);
  }

  showProcessing() {
    this.filterState = 'processing';
    this.submittedFormsList = _.filter(this.allSubmittedFormsList, (history) => history.form_status == 1);
  }

  checkIfHasMore() {
    return _.isNull(this.clientService.nextPaginationUrl) ? false : true;
  }

  getAllUnsentForms() {
    this.loading = true;
    const client_id = _.toString(this.user.id);
    this.clientService.getAllSubmittedForms(client_id).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            this.submittedFormsList.push(form);
          });
          this.allSubmittedFormsList = this.submittedFormsList;
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
    const client_id = _.toString(this.user.id);
    const moreUrl = this.clientService.nextPaginationUrl;
    this.clientService.getAllSubmittedForms(client_id, moreUrl).then(
      forms => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(forms, (form) => {
          this.submittedFormsList.push(form);
        });
        this.allSubmittedFormsList = this.submittedFormsList;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getAllUnsentForms();
  }

}
