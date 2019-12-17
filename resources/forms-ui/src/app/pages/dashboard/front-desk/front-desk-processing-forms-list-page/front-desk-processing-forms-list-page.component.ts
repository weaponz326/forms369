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
  responseMessage: string;
  loadingModalRef: NgbModalRef;
  processingFormsList: Array<any>;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('response', { static: false }) responseModal: TemplateRef<any>;
  @ViewChild('complete', { static: false }) completedModal: TemplateRef<any>;

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

  open(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/front_desk/view_form', { state: { form: form }});
  }

  showLoadingDialog() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  showResponseDialog() {
    this.modalService.open(this.responseModal, { centered: true });
  }

  handleLastItemSlice(list: any[]) {
    if (list.length == 0) {
      this.hasData = false;
    }
  }

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

  completeForm(e: Event, form: any, submission_code: string, index: number) {
    e.stopPropagation();
    this.modalService.open(this.completedModal, { centered: true }).result.then(
      result => {
        if (result == 'complete') {
          this.showLoadingDialog();
          this.frontDeskService.completeForm(submission_code, form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loadingModalRef.close();
                this.processingFormsList.splice(index, 1);
                this.handleLastItemSlice(this.processingFormsList);
                this.responseMessage = '1 Form Successfully Completed';
                this.showResponseDialog();
              }
              else {
                this.loadingModalRef.close();
                this.processingFormsList.splice(index, 1);
                this.handleLastItemSlice(this.processingFormsList);
                this.responseMessage = 'Form Failed to Complete';
                this.showResponseDialog();
              }
            },
            err => {
              this.loadingModalRef.close();
              this.responseMessage = 'Oops! An error occured completing this form. Please try again!.';
              this.showResponseDialog();
            }
          );
        }
      }
    );
  }

  rejectForm(e: Event, form: any, submission_code: string, index: number) {
    e.stopPropagation();
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'undo') {
          this.showLoadingDialog();
          this.frontDeskService.unprocessForm(submission_code, form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loadingModalRef.close();
                this.processingFormsList.splice(index, 1);
                this.handleLastItemSlice(this.processingFormsList);
                this.responseMessage = '1 Form Successfully Rejected';
                this.showResponseDialog();
              }
              else {
                this.loadingModalRef.close();
                this.processingFormsList.splice(index, 1);
                this.handleLastItemSlice(this.processingFormsList);
                this.responseMessage = 'Form Rejection Failed';
                this.showResponseDialog();
              }
            },
            err => {
              this.loadingModalRef.close();
              this.responseMessage = 'Oops! An error occured rejecting this form. Please try again!.';
              this.showResponseDialog();
            }
          );
        }
      }
    );
  }

  retry() {
    this.getAllFormsInProcessing();
  }
}