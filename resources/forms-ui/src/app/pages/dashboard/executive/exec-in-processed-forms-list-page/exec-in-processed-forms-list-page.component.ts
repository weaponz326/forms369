import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-in-processed-forms-list-page',
  templateUrl: './exec-in-processed-forms-list-page.component.html',
  styleUrls: ['./exec-in-processed-forms-list-page.component.css']
})
export class ExecInProcessedFormsListPageComponent implements OnInit {
  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  processingFormsList: Array<any>;
  loadingModalRef: NgbModalRef;
  completedModalRef: NgbModalRef;
  @ViewChild('loading', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('completed', { static: false }) completedModal: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processingFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllFormsInProcessing();
  }

  ngOnInit() {
  }

  showLoadingDialog() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  showConfirmDialog() {}

  showCompletedDialog() {}

  showNotCompleteDialog() {}

  getAllFormsInProcessing() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id).then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            this.processingFormsList.push(form);
          });
          this.loading = false;
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

  complete(submission_code: string) {
    this.showLoadingDialog();
    this.frontDeskService.completeForm(submission_code).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          this.loadingModalRef.close();
          this.showCompletedDialog();
        }
        else {
          this.loadingModalRef.close();
          this.showNotCompleteDialog();
        }
      },
      err => {
        this.loadingModalRef.close();
        this.showNotCompleteDialog();
      }
    );
  }

  unprocess(submission_code: string) {
    this.showLoadingDialog();
    this.frontDeskService.unprocessForm(submission_code).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          this.loadingModalRef.close();
          this.showCompletedDialog();
        }
        else {
          this.loadingModalRef.close();
          this.showNotCompleteDialog();
        }
      },
      err => {
        this.hasError = true;
        this.loadingModalRef.close();
        this.showNotCompleteDialog();
      }
    );
  }

  retry() {
    this.getAllFormsInProcessing();
  }

}
