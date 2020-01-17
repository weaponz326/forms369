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
    if (!_.isUndefined(this.form)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_form', JSON.stringify(this.form));
    }
    else {
      this.form = JSON.parse(sessionStorage.getItem('u_form'));
    }
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
          this.submit().then(
            ok => {
              if (ok) {
                console.log('submit done');
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
            },
            err => {
              this.hasError = true;
              this.loading = false;
              this.completed = false;
              console.log('error submitting details');
            }
          );
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
          this.submit().then(
            ok => {
              if (ok) {
                console.log('submitting done');
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
            },
            err => {
              this.hasError = true;
              this.loading = false;
              this.completed = false;
              console.log('error while submitting');
            }
          );
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
          this.submit().then(
            ok => {
              if (ok) {
                console.log('submit done');
                this.frontDeskService.unprocessForm(this.form.submission_code, this.form.client_submitted_details).then(
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
            },
            err => {
              this.hasError = true;
              this.loading = false;
              this.completed = false;
              console.log('error while submitting');
            }
          );
        }
      }
    );
  }

  getExistingAttachments(unfilled_fields: any[]) {
    // This gets all the existing attachments so they can be uploaded
    // if the user doesnt choose any new file.
    const fields = [];
    _.forEach(this.existingAttachments, (attachment) => {
      console.log('attachment: ' + JSON.stringify(attachment));
      _.forEach(unfilled_fields, (field) => {
        if (field.type == 'file') {
          if (attachment.key == field.name) {
            fields.push(field);
          }
        }
      });
    });

    console.log('unfilleed: ' + JSON.stringify(fields));
    return fields;
  }

  uploadFormFile(form_code: string, key: string, index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, form_code, key, this.attachmentFiles[index]).then(
        ok => {
          if (ok) {
            console.log('file upload done');
            resolve(true);
          }
          else {
            console.log('file upload failed');
            resolve(false);
          }
        },
        err => {
          console.log('file upload error');
          reject(err);
        }
      );
    });
  }

  uploadFormAttachments(form_code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('doing upload');
      const promises = [];
      const num_of_attachments = this.attachmentFiles.length;
      if (num_of_attachments > 1) {
        console.log('will do multiple uploads');
        for (let i = 0; i < num_of_attachments; i++) {
          const p = this.uploadFormFile(form_code, this.attachmentKeys[i], i);
          promises.push(p);

          if (i == num_of_attachments) {
            Promise.all(promises).then(
              res => {
                resolve(true);
              },
              err => {
                reject(false);
              }
            );
          }
        }
      }
      else {
        console.log('will do single upload');
        this.uploadFormFile(form_code, this.attachmentKeys[0], 0).then(
          ok => {
            ok ? resolve(true) : resolve(false);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }

  submitFormWithAttachments(user_data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('is submitting');
      const filled_data = this.formBuilder.getFormUserData(user_data);
      const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.form.client_submitted_details);
      console.log('new updates: ' + updated_data);
      this.clientService.editProfile(this.user.id.toString(), JSON.parse(updated_data)).then(
        res => {
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            console.log('uploading attachment has started');
            this.uploadFormAttachments(this.form.submission_code).then(
              ok => {
                ok ? resolve(true) : resolve(false);
              },
              err => {
                reject(err);
              }
            );
          }
          else {
            reject();
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  submitFormWithoutAttachments(user_data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('is submitting');
      console.log('user_data: ' + JSON.stringify(user_data));
      const filled_data = this.formBuilder.getFormUserData(user_data);
      console.log('filled_data: ' + filled_data);
      const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.form.client_submitted_details);
      console.log('new updates: ' + updated_data);
      this.clientService.editProfile(this.user.id.toString(), JSON.parse(updated_data)).then(
        res => {
          console.log('edit res');
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            console.log('faileD: ' + response.message);
            resolve(false);
          }
        },
        err => {
          console.log('edit err');
          reject(err);
        }
      );
    });
  }

  submit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user_data = this.getFormData();
      console.log(JSON.stringify(user_data));
      const unfilled = this.clientService.validateFormFilled(user_data);
      console.log('unfilled: ' + JSON.stringify(unfilled));
      if (unfilled.length != 0) {
        const fileFields = this.getExistingAttachments(unfilled);
        console.log('fileFields: ' + JSON.stringify(fileFields));
        if (fileFields.length != 0) {
          this.loading = false;
          this.clientService.highlightUnFilledFormFields(unfilled);
        }
        else {
          if (this.attachmentFiles.length > 0) {
            // front desk added new files
            console.log('front desk added files uploading');
            this.submitFormWithAttachments(user_data).then(
              ok => {
                ok ? resolve(true) : resolve(false);
              },
              err => {
                reject(err);
              }
            );
          }
          else {
            console.log('submitting without attachment');
            this.submitFormWithoutAttachments(user_data).then(
              ok => {
                ok ? resolve(true) : resolve(false);
              },
              err => {
                reject(err);
              }
            );
          }
        }
      }
      else {
        // since everything checks out, we dont have to upload the attachments too.
        this.submitFormWithoutAttachments(user_data).then(
          ok => {
            ok ? resolve(true) : resolve(false);
          },
          err => {
            reject(err);
          }
        );
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
