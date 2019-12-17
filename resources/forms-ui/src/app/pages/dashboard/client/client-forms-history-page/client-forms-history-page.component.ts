import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Users } from 'src/app/models/users.model';

@Component({
  selector: 'app-client-forms-history-page',
  templateUrl: './client-forms-history-page.component.html',
  styleUrls: ['./client-forms-history-page.component.css']
})
export class ClientFormsHistoryPageComponent implements OnInit {

  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  filterState: string;
  historyCollection: Array<any>;
  allHistoryCollection: Array<any>;
  processedHistoryCollection: Array<any>;
  processingHistoryCollection: Array<any>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorageService: LocalStorageService
  ) {
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.processedHistoryCollection = [];
    this.processingHistoryCollection = [];
    this.user = this.localStorageService.getUser();
    this.getAllHistory();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  openFormEntry(form: any) {
    this.router.navigateByUrl('/client/form_entry', { state: { form: form }});
  }

  pickForm() {
    this.router.navigateByUrl('/client/form_merchant');
  }

  showAll() {
    this.filterState = 'all';
    this.historyCollection =  this.allHistoryCollection;
  }

  showProcessed() {
    this.filterState = 'processed';
    this.historyCollection = _.filter(this.allHistoryCollection, (history) => history.form_status == 2);
  }

  showProcessing() {
    this.filterState = 'processing';
    this.historyCollection = _.filter(this.allHistoryCollection, (history) => history.form_status == 1);
  }

  getAllHistory() {
    this.loading = true;
    this.clientService.getAllSubmittedForms(_.toString(this.user.id)).then(
      forms => {
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  retry() {
    this.getAllHistory();
  }

}
