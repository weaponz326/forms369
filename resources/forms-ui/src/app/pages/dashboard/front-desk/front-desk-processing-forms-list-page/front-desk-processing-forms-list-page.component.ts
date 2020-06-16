import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-processing-forms-list-page',
  templateUrl: './front-desk-processing-forms-list-page.component.html',
  styleUrls: ['./front-desk-processing-forms-list-page.component.css']
})
export class FrontDeskProcessingFormsListPageComponent implements OnInit {
  user: Users;
  index: number;
  query: string;
  form: FormGroup;
  currentForm: any;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  submitted: boolean;
  can_print: boolean;
  noteForm: FormGroup;
  foundNoForm: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  submissionCode: string;
  responseMessage: string;
  loadingModalRef: NgbModalRef;
  processingFormsList: Array<any>;
  allProcessingFormsList: Array<any>;
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('response', { static: false }) responseModal: TemplateRef<any>;
  @ViewChild('complete', { static: false }) completedModal: TemplateRef<any>;
  @ViewChild('rejectNote', { static: false }) rejectNoteModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dateTime: DateTimeService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.query = '';
    this.processingFormsList = [];
    this.allProcessingFormsList = [];
    this.user = this.localStorage.getUser();
    this.can_print = this.user.can_print == 1 ? true : false;

    this.getAllFormsInProcessing();
  }

  ngOnInit() {
    this.initNoteForm();
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  public get _f() {
    return this.noteForm.controls;
  }

  initNoteForm() {
    this.noteForm = this.fb.group({
      rejectionNote: ['', Validators.required]
    });
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

  print(ev: Event, form: any) {
    ev.stopPropagation();
    this.can_print
      ? this.router.navigateByUrl('front_desk/print_form', { state: { form: form } })
      : this.router.navigateByUrl('front_desk/print_form_default', { state: { form: form } });
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

  getAllFormsInProcessing() {
    this.loading = true;
    this.frontDeskService.getProcessedFormsByFrontDesk(_.toString(this.user.id), 1).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(res, (form) => {
            form.submitted_at = this.dateTime.safeDateFormat(form.submitted_at);
            this.processingFormsList.push(form);
          });
          this.allProcessingFormsList = this.processingFormsList;
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
    this.frontDeskService.getProcessedFormsByFrontDesk(_.toString(this.user.id), 1, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          form.submitted_at = this.dateTime.safeDateFormat(form.submitted_at);
          this.processingFormsList.push(form);
        });
        this.allProcessingFormsList = this.processingFormsList;
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
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

  reject(e: Event, form: any, submission_code: string, index: number) {
    e.stopPropagation();
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'undo') {
          this.index = index;
          this.currentForm = form;
          this.submissionCode = submission_code;
          this.modalService.dismissAll();
          this.handleRejectionNote();
        }
      }
    );
  }

  rejectForm() {
    this.modalService.dismissAll();
    this.showLoadingDialog();
    this.frontDeskService.rejectForm(this.submissionCode, this.currentForm.client_submitted_details).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          console.log('sending out the rejectioon review note');
          this.frontDeskService.sendFormRejectionNote(this.submissionCode, this._f.rejectionNote.value).then(
            ok => {
              if (ok) {
                this.loadingModalRef.close();
                this.processingFormsList.splice(this.index, 1);
                this.handleLastItemSlice(this.processingFormsList);
                this.responseMessage = '1 Form Successfully Rejected';
                this.showResponseDialog();
              }
            }
          );
        }
        else {
          this.loadingModalRef.close();
          this.processingFormsList.splice(this.index, 1);
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

  handleRejectionNote() {
    this.modalService.open(this.rejectNoteModal, { centered: true });
  }

  searchByFormNameOrCode() {
    this.loading = true;
    this.processingFormsList = [];
    this.allProcessingFormsList = [];
    this.frontDeskService.findFormByNameAndStatus(this.query, this.user.merchant_id.toString(), 1).then(
      forms => {
        if (forms.length == 0) {
          this.loading = false;
          this.hasData = false;
          this.foundNoForm = true;
        }
        else {
          this.hasData = true;
          this.loading = false;
          this.foundNoForm = false;
          _.forEach(forms, (form) => {
            this.processingFormsList.push(form);
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
      this.hasMore = false;
      if (this.query.length != 0) {
        console.log('searching by form name or code');
        this.searchByFormNameOrCode();
      }
      else {
        console.log('resetting ...');
        if ((this.foundNoForm && this.query.length == 0) || this.query.length == 0) {
          this.hasData = true;
          this.foundNoForm = false;
          console.log('hererereererere');
          this.getAllFormsInProcessing();
        }
      }
    }
  }

  filter() {
    this.submitted = true;
    this.processingFormsList = this.allProcessingFormsList;
    console.log('processlist length: ' + this.processingFormsList.length);
    if (this.form.invalid) {
      console.log('filter form error: ' + this.form.errors);
    }
    else {
      const end = this.f.endDate.value;
      const start = this.f.startDate.value;

      // Bootstrap date picker returns single digit for months from Jan to Sept
      // In order to allow us to compare against MYSQL which returns double digits
      // for that, we convert the month accordingly.
      const end_date = this.dateTime.bootstrapDateFormat(end);
      const start_date = this.dateTime.bootstrapDateFormat(start);

      console.log(start_date);
      console.log(end_date);

      // Filter forms list.
      this.processingFormsList = _.filter(this.processingFormsList,
        (form) =>
          this.dateTime.getDatePart(form.last_processed) >= start_date &&
          this.dateTime.getDatePart(form.last_processed) <= end_date
      );
    }
  }

  retry() {
    this.getAllFormsInProcessing();
  }
}