import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-rejected-forms-list-page',
  templateUrl: './front-desk-rejected-forms-list-page.component.html',
  styleUrls: ['./front-desk-rejected-forms-list-page.component.css']
})
export class FrontDeskRejectedFormsListPageComponent implements OnInit {

  user: Users;
  form: FormGroup;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  submitted: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  responseMessage: string;
  loadingModalRef: NgbModalRef;
  rejectedFormsList: Array<any>;
  allRejectedFormsList: Array<any>;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('process', { static: false }) processModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('response', { static: false }) responseModal: TemplateRef<any>;
  @ViewChild('complete', { static: false }) completedModal: TemplateRef<any>;
  @ViewChild('rejectMessage', { static: false }) rejectMessageModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dateTime: DateTimeService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.rejectedFormsList = [];
    this.allRejectedFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllFormsRejected();
  }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.fb.group({
      endDate: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  open(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/front_desk/view_form', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
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

  getAllFormsRejected() {
    this.loading = true;
    this.frontDeskService.getProcessedFormsByFrontDesk(_.toString(this.user.id), 3).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(res, (form) => {
            this.rejectedFormsList.push(form);
          });
          this.allRejectedFormsList = this.rejectedFormsList;
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
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getProcessedFormsByFrontDesk(_.toString(this.user.id), 3, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          this.rejectedFormsList.push(form);
        });
        this.allRejectedFormsList = this.rejectedFormsList;
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  processForm(e: Event, form: any, submission_code: string, index: number) {
    e.stopPropagation();
    this.modalService.open(this.processModal, { centered: true }).result.then(
      result => {
        if (result == 'process') {
          this.showLoadingDialog();
          this.frontDeskService.processForm(submission_code, form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loadingModalRef.close();
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
                this.responseMessage = '1 Form Successfully In Process';
                this.showResponseDialog();
              }
              else {
                this.loadingModalRef.close();
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
                this.responseMessage = 'Failed To Process Form';
                this.showResponseDialog();
              }
            },
            err => {
              this.loadingModalRef.close();
              this.responseMessage = 'Oops! An error occured processing this form. Please try again!.';
              this.showResponseDialog();
            }
          );
        }
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
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
                this.responseMessage = '1 Form Successfully Completed';
                this.showResponseDialog();
              }
              else {
                this.loadingModalRef.close();
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
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
          this.frontDeskService.rejectForm(submission_code, form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loadingModalRef.close();
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
                this.responseMessage = '1 Form Successfully Rejected';
                this.showResponseDialog();
              }
              else {
                this.loadingModalRef.close();
                this.rejectedFormsList.splice(index, 1);
                this.handleLastItemSlice(this.rejectedFormsList);
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

  filter() {
    this.submitted = true;
    this.rejectedFormsList = this.allRejectedFormsList;
    console.log('processlist length: ' + this.rejectedFormsList.length);
    if (this.form.invalid) {
      console.log('filter form error: ' + this.form.errors);
    }
    else {
      const end = this.f.endDate.value;
      const start = this.f.startDate.value;

      // Bootstrap date picker returns single digit for months from Jan to Sept
      // In order to allow us to compare against MYSQL which returns double digits
      // for that, we convert the month accordingly.
      const end_month = _.toNumber(end.month) <= 9 ? '0' + end.month : end.month;
      const start_month = _.toNumber(start.month) <= 9 ? '0' + start.month : start.month;

      const end_date = end.year + '-' + end_month + '-' + end.day;
      const start_date = start.year + '-' + start_month + '-' + start.day;
      console.log(start_date);
      console.log(end_date);

      // Filter forms list.
      this.rejectedFormsList = _.filter(this.rejectedFormsList,
        (form) =>
          this.dateTime.getDatePart(form.last_processed) >= start_date &&
          this.dateTime.getDatePart(form.last_processed) <= end_date
      );
    }
  }

  retry() {
    this.getAllFormsRejected();
  }

}
