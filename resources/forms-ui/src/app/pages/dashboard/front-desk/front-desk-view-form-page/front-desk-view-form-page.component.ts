declare var $: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-front-desk-view-form-page',
  templateUrl: './front-desk-view-form-page.component.html',
  styleUrls: ['./front-desk-view-form-page.component.css']
})
export class FrontDeskViewFormPageComponent implements OnInit {

  form: any;
  user: Users;
  imgUrl: string;
  action: string;
  formName: string;
  loading: boolean;
  isLoading: boolean;
  formInstance: any;
  formRenderer: any;
  hasError: boolean;
  rejected: boolean;
  completed: boolean;
  submitted: boolean;
  _submitted: boolean;
  documentUrl: string;
  noteForm: FormGroup;
  abuseForm: FormGroup;
  isProcessed: boolean;
  isProcessing: boolean;
  lastProcessed: string;
  hasSignature: boolean;
  showAttachments: boolean;
  signatureImageUrl: string;
  docDialogRef: NgbModalRef;
  loadingAttachments: boolean;
  attachmentFiles: Array<File>;
  attachmentKeys: Array<string>;
  existingAttachments: Array<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('rejectNote', { static: false }) rejectNoteModal: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;
  @ViewChild('abuseReportMessage', { static: false }) abuseReportDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private reloader: ReloadingService,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
    private frontDeskService: FrontDeskService
  ) {
    this.attachmentKeys = [];
    this.attachmentFiles = [];
    this.signatureImageUrl = '';
    this.existingAttachments = [];
    this.form = window.history.state.form;
    this.form = this.reloader.resolveDataLoss(this.form);

    this.formName = this.form.form_name;
    this.user = this.localStorage.getUser();
    this.hasSignature = this.form.require_signature == 1 ? true : false;
    console.log('form: ' + JSON.stringify(this.form));
    this.getFormAttachments(this.form.submission_code);
  }

  ngOnInit() {
    this.initNoteForm();
    this.initAbuseForm();
    this.renderForm();
  }

  public get f() {
    return this.noteForm.controls;
  }

  public get _f() {
    return this.abuseForm.controls;
  }

  initNoteForm() {
    this.noteForm = this.fb.group({
      rejectionNote: ['', Validators.required]
    });
  }

  initAbuseForm() {
    this.abuseForm = this.fb.group({
      abuseMessage: ['', Validators.required]
    });
  }

  showReportSuccessAlert() {
    Swal.fire(
      'Report Abuse',
      'Report has been sent successfully.',
      'success'
    );
  }

  showReportFailedAlert() {
    Swal.fire(
      'Abuse Report',
      'Report failed to send. Please check your internet connection and try again!.',
      'success'
    );
  }

  ok() {
    window.history.back();
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json' };
    this.formInstance = $(this.formRenderer).formRender(renderOptions);

    this.appendOnChangeEventToFileInput();
    this.setFormData(formData);
  }

  setFormData(data: any) {
    if (this.form.form_status == 2) {
      this.isProcessed = true;
      this.lastProcessed = this.form.last_processed;
      const client_data = this.form.client_submitted_details;
      this.frontDeskService.setFormWithClientData(data, client_data);
    }
    else if (this.form.form_status == 1) {
      this.isProcessing = true;
      this.lastProcessed = this.form.last_processed;
      const client_data = this.form.client_submitted_details;
      this.frontDeskService.setFormWithClientData(data, client_data);
    }
    else {
      const client_data = this.form.client_submitted_details;
      this.frontDeskService.setFormWithClientData(data, client_data);
    }

    this.disableFileInputField();
  }

  disableFileInputField() {
    const allInputFields = document.querySelectorAll('input');
    _.forEach(allInputFields, (field) => {
      if (field.type == 'file') {
        field.disabled = true;
      }
    });
  }

  getFormData() {
    return this.formInstance.userData;
  }

  appendOnChangeEventToFileInput() {
    const all_inputs = document.querySelectorAll('input');
    _.forEach(all_inputs, (input) => {
      if (input.type == 'file') {
        this.attachmentKeys.push(input.id);
        input.onchange = (e: any) => {
          const file = e.target.files[0] as File;
          console.log(file);
          this.attachmentFiles.push(file);
        };
      }
    });
  }

  getSignature() {
    this.clientService.getProfileFormAttachment(this.form.client_id).then(
      res => {
        if (res.length > 0) {
          _.forEach(res, (doc) => {
            if (doc.key == 'signature') {
              this.hasSignature = true;
              this.signatureImageUrl = this.endpointService.storageHost + 'attachments/' + doc.url;
            }
          });
        }
      },
      err => { }
    );
  }

  getFormAttachments(form_code: string) {
    this.loadingAttachments = true;
    this.clientService.getFormAttachment(form_code).then(
      res => {
        console.log('resssss: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.showAttachments = true;
          _.forEach(res, (doc) => {
            if (doc.key == 'signature') {
              if (this.hasSignature) {
                this.hasSignature = true;
                this.signatureImageUrl = this.endpointService.storageHost + 'attachments/' + doc.url;
              }
            }
            else {
              console.log('doc: ' + JSON.stringify(doc));
              this.existingAttachments.push(doc);
            }
          });
          if (this.hasSignature) {
            this.signatureImageUrl.length == 0 ? this.getSignature() : null;
          }
        }
        else {
          this.showAttachments =  false;
          if (this.hasSignature) {
            this.signatureImageUrl.length == 0 ? this.getSignature() : null;
          }
        }

        this.loadingAttachments = false;
      },
      err => {
        console.log('get_a_error: ' + JSON.stringify(err));
        this.loadingAttachments = false;
      }
    );
  }

  openModal(e: Event, url: string) {
    const index = url.lastIndexOf('.') + 1;
    const file_extension = url.substr(index);
    console.log('extension: ' + file_extension);
    if (file_extension == 'jpg' || file_extension == 'png' || file_extension == 'gif' || file_extension == 'jpeg') {
      this.openImageAttachmentModal(e, url);
    }
    else {
      this.openDocumentAttachmentModal(e, url);
    }
  }

  openImageAttachmentModal(e: Event, url: string) {
    e.stopPropagation();
    this.imgUrl = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.modalService.open(this.viewImgDialog, { centered: true });
  }

  openDocumentAttachmentModal(e: Event, url: string) {
    e.stopPropagation();
    this.documentUrl = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.docDialogRef = this.modalService.open(this.viewDocDialog, { centered: true });
  }

  complete() {
    this.action = 'complete';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          const user_data = this.getFormData();
          const filled_data = this.formBuilder.getFormUserData(user_data);
          this.frontDeskService.completeForm(this.form.submission_code, filled_data).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.completed = true;
              }
              else {
                this.loading = false;
                this.completed = false;
              }
            },
            err => {
              this.hasError = true;
              this.loading = false;
              this.completed = false;
            }
          );
        }
        else {
          this.hasError = true;
          this.loading = false;
          this.completed = false;
          console.log('submit failed');
        }
      }
    );
  }

  process() {
    this.action = 'process';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          const user_data = this.getFormData();
          const filled_data = this.formBuilder.getFormUserData(user_data);
          this.frontDeskService.processForm(this.form.submission_code, filled_data).then(
            res => {
              const response = res as any;
              console.log('process res');
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.submitted = true;
              }
              else {
                this.loading = false;
                this.submitted = false;
              }
            },
            err => {
              console.log('process err');
              this.loading = false;
              this.submitted = false;
              this.hasError = true;
            }
          );
        }
        else {
          this.hasError = true;
          this.loading = false;
          this.completed = false;
          console.log('submitting failed');
        }
      }
    );
  }

  reject() {
    this.action = 'reject';
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.modalService.dismissAll();
          this.handleRejectionNote();
        }
        else {
          this.hasError = true;
          this.loading = false;
          this.completed = false;
          console.log('submit failed');
        }
      }
    );
  }

  reportAbuse() {
    this.modalService.open(this.abuseReportDialog, { centered: true });
  }

  rejectForm() {
    this._submitted = true;
    if (this.noteForm.valid) {
      this.isLoading = true;
      this.modalService.dismissAll();
      const user_data = this.getFormData();
      const filled_data = this.formBuilder.getFormUserData(user_data);
      this.frontDeskService.rejectForm(this.form.submission_code, filled_data).then(
        res => {
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            console.log('sending out the rejection review note');
            this.frontDeskService.sendFormRejectionNote(this.form.submission_code, this.f.rejectionNote.value).then(
              ok => {
                if (ok) {
                  this.isLoading = false;
                  this.modalService.dismissAll();
                  this.rejected = true;
                }
                else {
                  this.isLoading = false;
                  this.modalService.dismissAll();
                  this.rejected = false;
                }

                this._submitted = false;
              }
            );
          }
          else {
            this.isLoading = false;
            this._submitted = false;
            this.modalService.dismissAll();
            this.rejected = false;
          }
        },
        err => {
          this.isLoading = false;
          this._submitted = false;
          this.modalService.dismissAll();
          this.rejected = false;
        }
      );
    }
  }

  reportUser() {
    this._submitted = true;
    if (this.abuseForm.valid) {
      this.isLoading = true;
      const message = this._f.abuseMessage.value;
      const client_id = this.form.client_id.toString();
      const merchant_id = this.user.merchant_id.toString();
      this.frontDeskService.reportAbuse(client_id, merchant_id, message).then(
        ok => {
          if (ok) {
            this.isLoading = false;
            this._submitted = false;
            this.modalService.dismissAll();
            this.showReportSuccessAlert();
          }
          else {
            this.isLoading = false;
            this._submitted = false;
            this.modalService.dismissAll();
            this.showReportFailedAlert();
          }
        },
        err => {
          this.isLoading = false;
          this._submitted = false;
          this.modalService.dismissAll();
        }
      );
    }
  }

  handleRejectionNote() {
    this.modalService.open(this.rejectNoteModal, { centered: true });
  }

  downloadDoc(url: string) {
    this.docDialogRef.close();
    this.downloadService.download(url);
  }

  download(url: string) {
    const file_url = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.downloadService.download(file_url);
  }

}
