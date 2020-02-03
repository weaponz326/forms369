import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
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
  formInstance: any;
  formRenderer: any;
  hasError: boolean;
  rejected: boolean;
  completed: boolean;
  submitted: boolean;
  documentUrl: string;
  isProcessed: boolean;
  isProcessing: boolean;
  lastProcessed: string;
  showAttachments: boolean;
  docDialogRef: NgbModalRef;
  loadingAttachments: boolean;
  attachmentFiles: Array<File>;
  attachmentKeys: Array<string>;
  existingAttachments: Array<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
    private frontDeskService: FrontDeskService
  ) {
    this.attachmentKeys = [];
    this.attachmentFiles = [];
    this.existingAttachments = [];
    this.form = window.history.state.form;
    this.resolveReloadDataLoss();
    this.formName = this.form.form_name;
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
    this.getFormAttachments(this.form.submission_code);
  }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this.form))
      sessionStorage.setItem('u_form', JSON.stringify(this.form));
    else
      this.form = JSON.parse(sessionStorage.getItem('u_form'));
  }

  ngOnInit() {
    this.renderForm();
  }

  ok() {
    this.router.navigateByUrl('front_desk');
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

  getFormAttachments(form_code: string) {
    this.loadingAttachments = true;
    this.clientService.getFormAttachment(form_code).then(
      res => {
        console.log('resssss: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.showAttachments = true;
          _.forEach(res, (doc) => {
            console.log('doc: ' + JSON.stringify(doc));
            this.existingAttachments.push(doc);
          });
        }
        else {
          this.showAttachments =  false;
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
          // this.submit().then(
          //   ok => {
          //     if (ok) {
          //       console.log('submit done');
          this.frontDeskService.completeForm(this.form.submission_code, this.form.client_submitted_details).then(
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
          this.frontDeskService.processForm(this.form.submission_code, this.form.client_submitted_details).then(
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
          this.loading = true;
          this.frontDeskService.rejectForm(this.form.submission_code, this.form.client_submitted_details).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.loading = false;
                this.rejected = true;
              }
              else {
                this.loading = false;
                this.rejected = false;
              }
            },
            err => {
              this.loading = false;
              this.hasError = true;
              this.rejected = false;
            }
          );
        }
        else {
          this.hasError = true;
          this.loading = false;
          this.completed = false;
          console.log('submit failed');
        }
      });
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
