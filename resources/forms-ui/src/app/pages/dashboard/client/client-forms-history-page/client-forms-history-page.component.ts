import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Users } from 'src/app/models/users.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-forms-history-page',
  templateUrl: './client-forms-history-page.component.html',
  styleUrls: ['./client-forms-history-page.component.css']
})
export class ClientFormsHistoryPageComponent implements OnInit {
  form: any;
  user: Users;
  query: string;
  status: number;
  endDate: string;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  startDate: string;
  hasError: boolean;
  searchTerm: string;
  filterState: string;
  foundNoForm: boolean;
  searchOption: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  rejectionNote: string;
  isDateSearch: boolean;
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
    private reloader: ReloadingService,
    private clientService: ClientService,
    private dateService: DateTimeService,
    private endpointService: EndpointService,
    private localStorageService: LocalStorageService
  ) {
    this.status = -1;
    this.searchOption = '';
    this.rejectionNote = '';
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.form = history.state.form;
    this.processedHistoryCollection = [];
    this.processingHistoryCollection = [];
    this.form = this.reloader.resolveDataLoss(this.form);
    this.user = this.localStorageService.getUser();

    this.listenOnRouteChange(this.router);
  }

  ngOnInit() {
    if (_.isNull(this.form) || _.isUndefined(this.form)) {
      this.filterState = 'all';
      this.getAllHistory();
    }
    else {
      this.showDrafts();
    }
  }

  listenOnRouteChange(router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filterState = 'all';
        sessionStorage.removeItem('u_form');
      }
    });
  }

  showDeleteFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Failed to delete. Please check your internet connection and try again'
    });
  }

  showMobileDownloadWarning() {
    alert('this is a mobile device');
    Swal.fire({
      title: 'Download PDF\'s Via Mobile App',
      icon: 'warning',
      text: 'Sorry you cannot download'
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
    this.status = -1;
    this.filterState = 'all';
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.getAllHistory();
  }

  selectSearchOption() {
    console.log('selected option: ' + this.searchOption);
    this.resetData();
    switch (this.searchOption) {
      case 'form_name':
        this.isDateSearch = false;
        this.searchTerm = 'by form name';
        break;
      case 'form_code':
        this.isDateSearch = false;
        this.searchTerm = 'by form code';
        break;
      case 'merchant_name':
        this.isDateSearch = false;
        this.searchTerm = 'by merchant name';
        break;
      case 'submission_date':
        this.isDateSearch = true;
        this.searchTerm = 'by submission date';
        break;
      default:
        break;
    }
  }

  showProcessed() {
    this.status = 2;
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.filterState = 'processed';
    this.clientService.getFormByStatus(_.toString(this.user.id), 2).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
        }
        else {
          this.hasData = true;
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
    this.status = 1;
    this.loading = true;
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.filterState = 'processing';
    this.clientService.getFormByStatus(_.toString(this.user.id), 1).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
        }
        else {
          this.hasData = true;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  showDrafts() {
    this.status = 4;
    this.loading = true;
    this.filterState = 'drafts';
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 4).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          console.log('drafts: ' + forms.length);
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
        }
        else {
          this.hasData = true;
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
    this.status = 0;
    this.loading = true;
    this.historyCollection = [];
    this.filterState = 'submitted';
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 0).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
          // this.hasMore ? this.handleLoadMoreVisibility(this.historyCollection) : null;
        }
        else {
          this.hasData = true;
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
    this.status = 3;
    this.loading = true;
    this.filterState = 'rejected';
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 3).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
        }
        else {
          this.hasData = true;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

  showReversed() {
    this.status = 5;
    this.loading = true;
    this.filterState = 'reversed';
    this.historyCollection = [];
    this.allHistoryCollection = [];
    this.clientService.getFormByStatus(_.toString(this.user.id), 5).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.historyCollection.push(form);
          });
          this.allHistoryCollection = this.historyCollection;
          const moreUrl = this.clientService.nextPaginationUrl;
          _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
        }
        else {
          this.hasData = true;
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
        this.rejectionNote = res.review;
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
    this.clientService.findFormsInHistoryByCode(this.user.id.toString(), this.query, this.status).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
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
    console.log('form name searc is running ... status: ' + this.status);
    this.loading = true;
    this.clientService.findFormsInHistoryByName(this.user.id.toString(), this.query, this.status).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
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

  searchByMerchantName() {
    console.log('merchant name searching is running ...');
    this.loading = true;
    this.clientService.findFormsInHistoryByMerchantName(this.user.id.toString(), this.query).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
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

  searchBySubmissionDate() {
    console.log('date search is running ...');
    this.loading = true;
    this.hasMore = false;
    this.hasError = false;
    this.historyCollection = [];

    const end_date = this.dateService.bootstrapDateFormat(this.endDate);
    const start_date = this.dateService.bootstrapDateFormat(this.startDate);

    this.clientService.findFormsInHistoryBySubmissionDate(this.user.id.toString(), start_date, end_date).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.foundNoForm = true;
        }
        else {
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
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
        console.log(this.query);
        this.hasMore = false;
        this.hasError = false;
        this.historyCollection = [];

        switch (this.searchOption) {
          case 'form_name':
            this.searchByFormName();
            break;
          case 'form_code':
            this.searchByFormCode();
            break;
          case 'merchant_name':
            this.searchByMerchantName();
            break;
          case 'submission_date':
            this.searchBySubmissionDate();
            break;
          default:
            break;
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

  resetData() {
    this.historyCollection = this.allHistoryCollection;
    this.hasMore = this.checkIfHasMore();
    if (this.foundNoForm && this.query.length == 0) {
      this.hasData = true;
      this.foundNoForm = false;
      this.historyCollection = this.allHistoryCollection;
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
            form.logo = this.endpointService.storageHost + form.logo;
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
          form.logo = this.endpointService.storageHost + form.logo;
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
        ok ? this.historyCollection.splice(index, 1) : this.showDeleteFailedAlert();
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

  checkIfIsMobileDevice(form: any) {
    console.log('width: ' + window.innerWidth);
    const isMobile = window.innerWidth == 280 || (window.innerWidth > 280 && window.innerWidth < 1025) ? true : false;
    isMobile
      ? this.showMobileDownloadWarning()
      : this.router.navigateByUrl('client/pdf_printing', { state: { form: form } });
  }

  download(form: any) {
    console.log(form);
    console.log('can_print: ' + this.user.can_print);
    this.checkIfIsMobileDevice(form);
    // this.router.navigateByUrl('client/pdf_printing', { state: { form: form } });
  }

  print(form: any) {
    this.router.navigateByUrl('client/printing', { state: { form: form }});
  }

  retry() {
    this.getAllHistory();
  }

}