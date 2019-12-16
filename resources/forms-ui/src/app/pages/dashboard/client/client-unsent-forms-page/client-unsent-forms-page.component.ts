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
  loading: boolean;
  hasError: boolean;
  filterState: string;
  isConnected: boolean;
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

  getAllUnsentForms() {
    this.loading = true;
    const client_id = _.toString(this.user.id);
    this.clientService.getAllSubmittedForms(client_id).then(
      res => {
        const forms = res as any;
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

  loadMore() {}

  retry() {
    this.getAllUnsentForms();
  }

}
