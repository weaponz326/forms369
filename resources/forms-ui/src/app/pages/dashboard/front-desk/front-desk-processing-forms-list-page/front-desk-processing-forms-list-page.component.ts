import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-processing-forms-list-page',
  templateUrl: './front-desk-processing-forms-list-page.component.html',
  styleUrls: ['./front-desk-processing-forms-list-page.component.css']
})
export class FrontDeskProcessingFormsListPageComponent implements OnInit {
  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  processingFormsList: Array<any>;
  // loadingModalRef: NgbModalRef;
  // confirmModalRef: NgbModalRef;
  // completedModalRef: NgbModalRef;
  // @ViewChild('load', { static: false }) loadingModal: TemplateRef<any>;
  // @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;
  // @ViewChild('completed', { static: false }) completedModal: TemplateRef<any>;

  constructor(
    private router: Router,
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

  open(form: any) {
    this.router.navigateByUrl('/front_desk/view_form', { state: { form: form }});
  }

  // showLoadingDialog() {
  //   this.modalService.open(this.loadingModal, { centered: true });
  // }

  // showConfirmDialog() {
  //   this.confirmModalRef = this.modalService.open(this.confirmModal, { centered: true });
  // }

  // showCompletedDialog() {
  //   this.completedModalRef = this.modalService.open(this.completedModal, { centered: true });
  // }

  showNotCompleteDialog() {}

  getAllFormsInProcessing() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id).then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(res, (form) => {
            this.processingFormsList.push(form);
          });
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
    // this.showLoadingDialog();
    this.frontDeskService.completeForm(submission_code, '').then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          // this.loadingModalRef.close();
          // this.showCompletedDialog();
        }
        else {
          // this.loadingModalRef.close();
          this.showNotCompleteDialog();
        }
      },
      err => {
        // this.loadingModalRef.close();
        this.showNotCompleteDialog();
      }
    );
  }

  unprocess(submission_code: string) {
    // this.showLoadingDialog();
    this.frontDeskService.unprocessForm(submission_code, '').then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          // this.loadingModalRef.close();
          // this.showCompletedDialog();
        }
        else {
          // this.loadingModalRef.close();
          this.showNotCompleteDialog();
        }
      },
      err => {
        this.hasError = true;
        // this.loadingModalRef.close();
        this.showNotCompleteDialog();
      }
    );
  }

  retry() {
    this.getAllFormsInProcessing();
  }
}