import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Users } from 'src/app/models/users.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-client-forms-entry-page',
  templateUrl: './client-forms-entry-page.component.html',
  styleUrls: ['./client-forms-entry-page.component.css']
})
export class ClientFormsEntryPageComponent implements OnInit {

  form: any;
  user: Users;
  imgUrl: string;
  loading: boolean;
  created: boolean;
  hasFile: boolean;
  formFiles: number;
  formInstance: any;
  formRenderer: any;
  clientProfile: any;
  formGenCode: string;
  documentUrl: string;
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
    private modalServiuce: NgbModal,
    private clipboard: ClipboardService,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
  ) {
    this.formFiles = 0;
    this.attachmentKeys = [];
    this.attachmentFiles = [];
    this.existingAttachments = [];
    this.form = history.state.form;
    this.resolveReloadDataLoss();
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
    this.getFormAttachments(this.form.submission_code);
  }

  ngOnInit() {
    this.renderForm();
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

  renderForm() {
    const formData = this.form.form_fields;
    this.checkIfHasFileUpload(formData);
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json' };
    this.formInstance = $(this.formRenderer).formRender(renderOptions);

    this.appendOnChangeEventToFileInput();
    this.setFormData(formData);
  }

  setFormData(data: any) {
    this.clientService.getDetails(_.toString(this.user.id)).then(
      res => {
        console.log('user_data: ' + JSON.stringify(res));
        this.clientProfile = res;
        this.clientService.autoFillFormData(data, res.client_details[0]);
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
      }
    );
  }

  getFormData() {
    return this.formInstance.userData;
  }

  appendOnChangeEventToFileInput() {
    const all_inputs = document.querySelectorAll('input');
    _.forEach(all_inputs, (input) => {
      if (input.type == 'file') {
        input.onchange = (e: any) => {
          const file = e.target.files[0] as File;
          console.log(file);
          this.attachmentFiles.push(file);
        };
      }
    });
  }

  checkIfHasFileUpload(form_data: any) {
    _.forEach(form_data, (fields) => {
      if (fields.type == 'file') {
        this.hasFile = true;
        this.formFiles += 1;
        this.attachmentKeys.push(fields.name);
      }
    });
  }

  willUseExistingAttachment(unfilled_fields: any[]) {
    // Over here, we ensure if there are existing attachments
    // and the input["file"] is empty we dont prevent them from
    let fields = [];
    _.forEach(this.existingAttachments, (attachment) => {
      _.forEach(unfilled_fields, (field) => {
        if (attachment.key == field.name) {
          fields = _.filter(unfilled_fields, (f) => f.name != field.name);
        }
      });
    });

    console.log('unfilllllllllleeeeed: ' + JSON.stringify(fields));
    return fields;
  }

  submitFormWithAttachments(user_data: any) {
    console.log('is submitting');
    const filled_data = this.formBuilder.getFormUserData(user_data);
    const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile.client_details[0]);
    console.log('new updates: ' + updated_data);
    this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile.client_details[0], JSON.parse(updated_data)).then(
      res => {
        this.formGenCode = res.code;
        if (this.hasFile) {
          this.uploadFormAttachments(this.formGenCode);
        }
      },
      err => {
        this.loading = false;
      }
    );
  }

  submitFormWithoutAttachments(user_data: any) {
    console.log('is submitting in unfilled');
    const filled_data = this.formBuilder.getFormUserData(user_data);
    const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile.client_details[0]);
    console.log('new updates: ' + updated_data);
    this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile.client_details[0], JSON.parse(updated_data)).then(
      res => {
        this.created = true;
        this.loading = false;
        this.formGenCode = res.code;
      },
      err => {
        this.loading = false;
      }
    );
  }

  submit() {
    this.modalServiuce.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.loading = true;
          const user_data = this.getFormData();
          console.log(JSON.stringify(user_data));
          console.log('this form: ' + this.formBuilder.getFormUserData(user_data));
          const unfilled = this.clientService.validateFormFilled(user_data);
          if (unfilled.length != 0) {
            const fields = this.willUseExistingAttachment(unfilled);
            console.log('unfilled: ' + JSON.stringify(unfilled));
            console.log('unfilled_1: ' + JSON.stringify(fields));
            if (fields.length > 0) {
              this.loading = false;
              this.clientService.highlightUnFilledFormFields(fields);
            }
            else {
              this.submitFormWithoutAttachments(user_data);
            }
          }
          else {
            this.submitFormWithAttachments(user_data);
          }
        }
      }
    );
  }

  uploadFormFile(form_code: string, key: string, index?: number) {
    if (_.isUndefined(index) || _.isNull(index)) {
      this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, form_code, key, this.attachmentFiles[0]).then(
        ok => {
          if (ok) {
            console.log('file upload done');
            this.created = true;
            this.loading = false;
          }
          else {
            console.log('file upload failed');
            this.loading = false;
          }
        },
        err => {
          console.log('file upload error');
          this.loading = false;
        }
      );
    }
    else {
      // its being called in a loop, this means there are more than one attachments.
      this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, form_code, key, this.attachmentFiles[index]).then(
        ok => {
          if (ok) {
            console.log('file upload done');
            this.created = true;
            this.loading = false;
          }
          else {
            console.log('file upload failed');
            this.loading = false;
          }
        },
        err => {
          console.log('file upload error');
          this.loading = false;
        }
      );
    }
  }

  uploadFormAttachments(form_code: string) {
    // we can tell the number of attachments this form has by
    // checking the formFiles variable's value.
    console.log('doing upload');
    const num_of_attachments = this.formFiles;
    if (num_of_attachments > 1) {
      console.log('will do multiple uploads');
      for (let i = 0; i < num_of_attachments; i++) {
        this.uploadFormFile(form_code, this.attachmentKeys[i], i);
      }
    }
    else {
      console.log('will do single upload');
      this.uploadFormFile(form_code, this.attachmentKeys[0]);
    }
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

  detectAttachmentIcon(extension: string) {
    switch (extension) {
      case 'jpg':
      case 'png':
      case 'gif':
      case 'jpeg':
        return 'mdi mdi-image';
      case 'doc':
      case 'xls':
      case 'docx':
        return 'mdi mdi-document';
      default:
        return 'mdi mdi-text';
    }
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
    this.modalServiuce.open(this.viewImgDialog, { centered: true });
  }

  openDocumentAttachmentModal(e: Event, url: string) {
    e.stopPropagation();
    this.documentUrl = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.docDialogRef = this.modalServiuce.open(this.viewDocDialog, { centered: true });
  }

  copy() {
    this.clipboard.copyFromContent(this.formGenCode);
  }

  cancel() {
    window.history.back();
  }

  ok() {
    this.router.navigateByUrl('/client/unsent_forms');
  }

  downloadDoc(url: string) {
    this.docDialogRef.close();
    this.download(url);
  }

  download(url: string) {
    const file_url = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.downloadService.download(file_url);
  }

}
