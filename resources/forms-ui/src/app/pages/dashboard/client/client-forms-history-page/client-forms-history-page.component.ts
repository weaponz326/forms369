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
  query: string;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  foundNoForm: boolean;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
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

  handleLoadMoreVisibility(list: Array<any>) {
    _.isNull(list) || _.isUndefined(list) || _.isEmpty(list) || list.length <= 15 ? this.hasMore = false : this.hasMore = true;
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
    const moreUrl = this.clientService.nextPaginationUrl;
    _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
  }

  showProcessed() {
    this.filterState = 'processed';
    this.historyCollection = _.filter(this.allHistoryCollection, (history) => history.form_status == 2);
    this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
  }

  showProcessing() {
    this.filterState = 'processing';
    this.historyCollection = _.filter(this.allHistoryCollection, (history) => history.form_status == 1);
    this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
  }

  checkIfHasMore() {
    return _.isNull(this.clientService.nextPaginationUrl) ? false : true;
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
            // this.formsList.push(form);
            this.historyCollection.push(form);
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
    this.historyCollection = _.filter(this.historyCollection, (item) => _.includes(_.toLower(item.form_name), _.toLower(this.query)));
    console.log(this.historyCollection);
    // this.loading = true;
    // this.clientService.findFormsByName(this.query).then(
    //   forms => {
    //     if (forms.length == 0) {
    //       this.loading = false;
    //       this.foundNoForm = true;
    //     }
    //     else {
    //       this.loading = false;
    //       this.foundNoForm = false;
    //       _.forEach(forms, (form) => {
    //         // this.formsList.push(form);
    //         this.historyCollection = [];
    //         this.historyCollection.push(form);
    //       });
    //     }
    //   },
    //   err => {
    //     this.hasError = true;
    //     this.loading = false;
    //   }
    // );
  }

  search(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      if (this.query.length != 0) {
        // we need to know whether the user is searching by a form code
        // or the user is searching by a form name.
        // First, check if its a form code.
        console.log(this.query);
        this.hasMore = false;
        this.hasError = false;
        // this.formsList = [];
        this.historyCollection = this.allHistoryCollection;
        // this.companyList = [];
        if (/\d/.test(this.query)) {
          if (this.query.length == 6) {
            // search fby form code, based on the input
            // the user might be searching by a form code.
            console.log('searching by form code');
            this.searchByFormCode();
          }
          else {
            // the input contains a number but is more than 6 characters
            // in lenght, this might be a form name.
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
        this.historyCollection = this.allHistoryCollection;
        this.hasMore = this.checkIfHasMore();
        if (this.foundNoForm && this.query.length == 0) {
          this.hasData = true;
          this.foundNoForm = false;
          console.log('hererer');
          this.historyCollection = this.allHistoryCollection;
        }
      }
    }
  }

  getAllHistory() {
    this.loading = true;
    this.clientService.getAllSubmittedForms(_.toString(this.user.id)).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
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

  loadMore() {
    this.loadingMore = true;
    this.hasMoreError = false;
    const moreUrl = this.clientService.nextPaginationUrl;
    this.clientService.getAllSubmittedForms(_.toString(this.user.id), moreUrl).then(
      forms => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(forms, (form) => {
          this.historyCollection.push(form);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getAllHistory();
  }

}
