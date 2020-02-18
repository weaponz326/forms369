import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

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
  filterState: string;
  foundNoForm: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  rejectionNote: string;
  loadingReview: boolean;
  historyCollection: Array<any>;
  allHistoryCollection: Array<any>;
  processedHistoryCollection: Array<any>;
  processingHistoryCollection: Array<any>;
  @ViewChild('review', { static: false }) reviewDialog: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private clientService: ClientService,
    private dateService: DateTimeService,
    private downloadService: DownloaderService,
    private localStorageService: LocalStorageService
  ) {
    this.rejectionNote = '';
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

  showDeleteFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Failed to delete. Please check your internet connection and try again'
    });
  }

  handleLoadMoreVisibility(list: Array<any>) {
    _.isNull(list) || _.isUndefined(list) || _.isEmpty(list) || list.length <= 15 ? this.hasMore = false : this.hasMore = true;
  }

  openFormEntry(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/client/form_entry', { state: { form: form }});
  }

  pickForm() {
    this.router.navigateByUrl('/client/form_merchant');
  }

  showAll() {
    this.filterState = 'all';
    this.getAllHistory();
    // this.historyCollection =  this.allHistoryCollection;
    // const moreUrl = this.clientService.nextPaginationUrl;
    // _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
  }

  showProcessed() {
    this.filterState = 'processed';
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 2).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
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

  showProcessing() {
    this.filterState = 'processing';
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 1).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
          // this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
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

  showSubmitted() {
    this.filterState = 'submitted';
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 0).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
          // this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
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

  showRejected() {
    this.filterState = 'rejected';
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 3).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
          // this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
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

  checkIfHasMore() {
    return _.isNull(this.clientService.nextPaginationUrl) ? false : true;
  }

  openReview(ev: Event, submission_code: string) {
    ev.stopPropagation();
    this.modalService.open(this.reviewDialog, { centered: true });
    this.loadingReview = true;
    this.clientService.getRejectionReview(submission_code).then(
      res => {
        console.log('ressss: ' + res);
        this.rejectionNote = res.review.replace(/(?:\r\n|\r|\n)/g, '\n');
        this.loadingReview = false;
      },
      err => {
        console.log('error: ' + err);
        this.loadingReview = false;
      }
    );
  }

  searchByFormCode() {
    this.loading = true;
    console.log('form code searching is running...');
    this.clientService.findFormsInHistoryByCode(this.user.id.toString(), this.query).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
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
    console.log('form name searching is running ...');
    this.loading = true;
    this.clientService.findFormsInHistoryByName(this.user.id.toString(), this.query).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
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

  search(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      if (this.query.length != 0) {
        // we need to know whether the user is searching by a form code
        // or the user is searching by a form name.
        // First, check if its a form code.
        console.log(this.query);
        this.hasMore = false;
        this.hasError = false;
        this.historyCollection = [];

        if (/\d/.test(this.query) || this.query.length == 5) {
          console.log('searching by form code');
          this.searchByFormCode();
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
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
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
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          this.historyCollection.push(form);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  deleteFormHistory(submission_code: string, index: number) {
    this.clientService.deleteFormHistory(this.user.id.toString(), submission_code).then(
      ok => {
        if (ok) {
          this.historyCollection.splice(index, 1);
        }
        else {
          this.showDeleteFailedAlert();
        }
      },
      err => {
        console.log('error deleting form history');
        this.showDeleteFailedAlert();
      }
    );
  }

  delete(ev: Event, submission_code: string, index: number) {
    ev.stopPropagation();
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.deleteFormHistory(submission_code, index);
        }
      }
    );
  }

  download(form: any) {
    console.log('can_print: ' + this.user.can_print);
    console.log(form);
    // this.router.navigateByUrl('client/printing', { state: { form: form }});
    this.router.navigateByUrl('client/pdf_printing', { state: { form: form } });
    // this.router.navigateByUrl('client/pdf_printing');
    // this.user.can_print == 0
    //   ? this.router.navigateByUrl('client/printing')
    //   : this.router.navigateByUrl('client/pdf_printing');
  }

  retry() {
    this.getAllHistory();
  }

}