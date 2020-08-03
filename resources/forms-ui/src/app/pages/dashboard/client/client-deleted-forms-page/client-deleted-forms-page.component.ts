import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-deleted-forms-page',
  templateUrl: './client-deleted-forms-page.component.html',
  styleUrls: ['./client-deleted-forms-page.component.css']
})
export class ClientDeletedFormsPageComponent implements OnInit {

  form: any;
  user: Users;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  deletedCollection: Array<any>;
  allDeletedCollection: Array<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('confirmDelete', { static: false }) confirmDeleteDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private reloader: ReloadingService,
    private clientService: ClientService,
    private dateService: DateTimeService,
    private endpointService: EndpointService,
    private localStorageService: LocalStorageService
  ) {
    this.deletedCollection = [];
    this.allDeletedCollection = [];
    this.form = history.state.form;
    this.form = this.reloader.resolveDataLoss(this.form);
    this.user = this.localStorageService.getUser();
    this.getAllDeletedForms();
  }

  ngOnInit() {
  }

  showDeleteFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Failed to restore form. Please check your internet connection and try again.'
    });
  }

  checkIfHasMore() {
    return _.isNull(this.clientService.nextPaginationUrl) ? false : true;
  }

  getAllDeletedForms() {
    this.loading = true;
    this.clientService.getDeletedForms(_.toString(this.user.id)).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            form.logo = this.endpointService.storageHost + form.logo;
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.deletedCollection.push(form);
          });
          this.allDeletedCollection = this.deletedCollection;
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
    this.clientService.getDeletedForms(_.toString(this.user.id), moreUrl).then(
      forms => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(forms, (form) => {
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          this.deletedCollection.push(form);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  restoreForm(submission_code: string, index: number) {
    this.clientService.restoreDeletedForm(this.user.id.toString(), submission_code).then(
      ok => {
        if (ok) {
          this.deletedCollection.splice(index, 1);
          this.hasData = this.deletedCollection.length == 0 ? false : true;
        }
        else {
          this.showDeleteFailedAlert();
        }
      },
      err => {
        console.log('error restoring form');
        this.showDeleteFailedAlert();
      }
    );
  }

  deleteForm(submission_code: string, index: number) {
    this.clientService.deleteTrashedForm(submission_code).then(
      ok => {
        if (ok) {
          this.deletedCollection.splice(index, 1);
          this.hasData = this.deletedCollection.length == 0 ? false : true;
        }
        else {
          this.showDeleteFailedAlert();
        }
      },
      err => {
        console.log('error restoring form');
        this.showDeleteFailedAlert();
      }
    );
  }

  restore(ev: Event, submission_code: string, index: number) {
    ev.stopPropagation();
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.restoreForm(submission_code, index);
        }
      }
    );
  }

  delete(e: Event, submission_code: string, index: number) {
    e.stopPropagation();
    this.modalService.open(this.confirmDeleteDialog, { centered: true }).result.then(
      res => {
        res == 'yes' ? this.deleteForm(submission_code, index) : null;
      }
    );
  }

  retry() {
    this.getAllDeletedForms();
  }

}
