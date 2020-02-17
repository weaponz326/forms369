import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { SectionsService } from 'src/app/services/sections/sections.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.css']
})
export class ClientProfilePageComponent implements OnInit, AfterViewInit {
  user: any;
  userData: any;
  imgUrl: string;
  pinCode: string;
  hasData: boolean;
  allUserData: any;
  loading: boolean;
  deleting: boolean;
  formFiles: number;
  updating: boolean;
  hasError: boolean;
  submitted: boolean;
  isLoading: boolean;
  pinForm: FormGroup;
  pinMinimum: boolean;
  renderData: boolean;
  documentUrl: string;
  pinRequired: boolean;
  noFilledData: boolean;
  showAttachments: boolean;
  docDialogRef: NgbModalRef;
  pinDialogRef: NgbModalRef;
  loadingAttachments: boolean;
  allFormSections: Array<any>;
  duplicateFields: Array<any>;
  setPinDialogRef: NgbModalRef;
  attachmentFiles: Array<File>;
  attachmentKeys: Array<string>;
  existingAttachments: Array<any>;
  activeSectionFields: Array<any>;
  @ViewChild('pin', { static: false }) pinDialog: TemplateRef<any>;
  @ViewChild('setPin', { static: false }) setPinDialog: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;
  @ViewChild('deleteAttachment', { static: false }) deleteFileDialog: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private clientService: ClientService,
    private sectionService: SectionsService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService
  ) {
    this.pinCode = '';
    this.formFiles = 0;
    this.attachmentKeys = [];
    this.allFormSections = [];
    this.attachmentFiles = [];
    this.duplicateFields = [];
    this.activeSectionFields = [];
    this.existingAttachments = [];
    this.user = this.localStorage.getUser();
    console.log('user_id: ' + this.user.id);
  }

  ngOnInit() {
    // this.getAllFormSections();
  }

  ngAfterViewInit() {
    this.checkIfUserHasFormPin();
  }

  public get f() {
    return this.pinForm.controls;
  }

  renderSection(id: string) {
    console.log('render section: ' + id);
    this.renderData = true;
    _.forEach(this.allFormSections, (section) => {
      if (section.id == id) {
        console.log('selected section found');
        this.activeSectionFields = section.form_fields;
        setTimeout(() => {
          this.clientService.fillClientProfileData([section], this.userData);
          this.appendOnChangeEventToFileInput();
        }, 500);
      }
    });
  }

  renderAttachments() {
    this.renderData = false;
  }

  showPinCreatedSuccess() {
    Swal.fire({
      title: 'Pin Created',
      text: 'Your PIN has been successfully created',
      icon: 'success',
      confirmButtonText: 'Ok, Got It',
      onClose: () => {
        this.pinDialogRef = this.modalService.open(this.pinDialog, { centered: true });
      }
    });
  }

  showPinCreationFailed() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry! Failed to create your pin. Something went wrong. Please check your internet connection and try again or our servers may be down.',
      icon: 'error',
      confirmButtonColor: 'Hmm, Ok'
    });
  }

  showPinVerificationFailed() {
    Swal.fire({
      title: 'Oops!',
      text: 'Sorry! Wrong PIN entered. Please check and try again',
      icon: 'error',
      confirmButtonColor: 'Arrrgh, Ok'
    });
  }

  showPinCodeCheckErrorAlert() {
    Swal.fire({
      title: 'Oops!',
      text: 'An error occured. Please make sure you have an active internet connection or our servers maybe down.',
      icon: 'error',
      confirmButtonColor: 'Arrrgh, Ok'
    });
  }

  showUpdatedDialog(isSuccess: boolean) {
    if (isSuccess) {
      Swal.fire({
        title: 'Success!',
        text: 'You have successfully updated your account data',
        icon: 'success',
        confirmButtonColor: 'Ok',
        onClose: () => {
          this.reload();
        }
      });
    }
    else {
      Swal.fire({
        title: 'Profile Update Failed!',
        text: 'An error occured updating your account data. Our servers may be down or you dont have an active internet connection.',
        icon: 'error',
        confirmButtonColor: 'Ok'
      });
    }
  }

  initPinForm() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.pin.value)) {
      const value = this.f.pin.value.substring(0, this.f.pin.value.length - 1);
      this.f.pin.setValue(value);
    }
  }

  resolveStrCharacters_1(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.pinCode)) {
      const value = this.pinCode.substring(0, this.pinCode.length - 1);
      this.pinCode = value;
    }
  }

  getAllClientDataNew() {
    this.loading = true;
    this.formBuilder.getUserFilledData(_.toString(this.user.id)).then(
      res => {
        console.log('user_data: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.hasData = true;
          this.loading = false;
          this.allUserData = res[0].client_details[0];
          console.log('details: ' + this.allUserData);
          this.appendOnChangeEventToFileInput();
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  appendOnChangeEventToFileInput() {
    console.log('called appendOnChangeEventToFileInput');
    const all_inputs = document.querySelectorAll('input');
    console.log('appendOnChangeLength: ' + all_inputs.length);
    _.forEach(all_inputs, (input) => {
      if (input.type == 'file') {
        input.onchange = (e: any) => {
          console.log('in onchange');
          const file = e.target.files[0] as File;
          console.log(file);
          this.attachmentFiles.push(file);
          this.attachmentKeys.push(input.id);
        };
      }
    });
  }

  checkIfUserHasFormPin() {
    const hasPin = localStorage.getItem('has_pin');
    if (_.isNull(hasPin) || _.isUndefined(hasPin)) {
      this.clientService.checkFormSubmitPin(this.user.id.toString()).then(
        ok => {
          console.log('res: ' + JSON.stringify(ok));
          if (ok) {
            localStorage.setItem('has_pin', '1');
            this.handlePinCode();
          }
          else {
            this.handlePinCode();
          }
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          this.showPinCodeCheckErrorAlert();
        }
      );
    }
    else {
      this.handlePinCode();
    }
  }

  handlePinCode() {
    const hasPin = localStorage.getItem('has_pin');
    if (_.isNull(hasPin) || _.isUndefined(hasPin)) {
      this.setPinDialogRef = this.modalService.open(this.setPinDialog, { centered: true, keyboard: false, backdrop: 'static' });
    }
    else {
      this.pinDialogRef = this.modalService.open(this.pinDialog, { centered: true, keyboard: false, backdrop: 'static' });
    }
  }

  createPin() {
    this.submitted = true;
    const pin = this.f.pin.value;
    if (this.pinForm.valid) {
      this.isLoading = true;
      this.clientService.setFormSubmitPin(this.user.id.toString(), pin).then(
        ok => {
          if (ok) {
            this.pinCode = '';
            this.isLoading = false;
            this.submitted = false;
            this.setPinDialogRef.close();
            this.showPinCreatedSuccess();
            localStorage.setItem('has_pin', '1');
          }
          else {
            this.submitted = false;
            this.isLoading = false;
            this.setPinDialogRef.close();
            this.showPinCreationFailed();
          }
        },
        err => {
          this.submitted = false;
          this.isLoading = false;
          this.setPinDialogRef.close();
          this.showPinCreationFailed();
        }
      );
    }
  }

  verifyPin() {
    this.pinMinimum = false;
    this.pinRequired = false;

    if (this.pinCode == '') {
      this.pinRequired = true;
    }
    else if (this.pinCode.length < 4) {
      this.pinMinimum = true;
    }
    else {
      this.isLoading = true;
      this.pinMinimum = false;
      this.pinRequired = false;
      this.clientService.verifyFormSubmitPin(this.user.id.toString(), this.pinCode).then(
        ok => {
          if (ok) {
            this.pinCode = '';
            this.isLoading = false;
            this.pinDialogRef.close();
            this.getAllFormSections();
          }
          else {
            this.isLoading = false;
            this.showPinVerificationFailed();
          }
        },
        err => {
          this.isLoading = false;
          this.showPinVerificationFailed();
        }
      );
    }
  }

  getAllClientData() {
    this.loading = true;
    this.formBuilder.getUserFilledData(_.toString(this.user.id)).then(
      res => {
        console.log('user_data: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.hasData = true;
          this.loading = false;
          const userData = res[0].client_details[0];
          this.userData = res[0].client_details[0];
          console.log('details: ' + userData);
          setTimeout(() => {
            this.clientService.fillClientProfileData(this.allFormSections, userData);
            this.appendOnChangeEventToFileInput();
          }, 500);
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  getFormAttachments(user_id: string) {
    this.loadingAttachments = true;
    this.clientService.getProfileFormAttachment(user_id).then(
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

  transformToRealText(text: string) {
    if (_.includes(text, '-')) {
      return text.replace(/-/g, ' ');
    }
    else if (_.includes(text, '_')) {
      return _.replace(text, '_', ' ');
    }
    else {
      return text;
    }
  }

  getAllClientProfileData() {
    const user_form_data = {};
    const allElements = document.querySelectorAll('input');
    _.forEach(allElements, (element) => {
      if (element.type == 'radio') {
        const radio_label = element.nextSibling.textContent;
        console.log('radio_label: ' + radio_label);
        if (element.checked) {
          user_form_data[element.id] = radio_label;
        }
      }

      if (element.type == 'checkbox') {
        const checkbox_label = element.nextSibling.textContent;
        console.log('checkbox_label: ' + checkbox_label);
        if (element.checked) {
          user_form_data[element.id] = checkbox_label;
       }
      }

      if (element.type == 'date' || element.type == 'text') {
        console.log(element);
        console.log('is_input: ' + element.value);
        user_form_data[element.id] = element.value;
      }
    });

    console.log('submitted_data: ' + JSON.stringify(user_form_data));
    return JSON.stringify(user_form_data);
  }

  getAllFormSections() {
    this.loading = true;
    this.sectionService.getAllSections().then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          console.log('filled data');
          this.getFormAttachments(this.user.id);
          _.forEach(res, (section) => {
            this.allFormSections.push(section);
          });
          this.renderSection(this.allFormSections[0].id);
          this.getAllClientData();
        }
        else {
          console.log('no filled data');
          this.getFormAttachments(this.user.id);
          this.noFilledData = true;
          this.getAllClientDataNew();
        }
      },
      err => {
        this.loading = false;
      }
    );
  }

  updateAttachments(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.attachmentFiles.length != 0) {
        _.forEach(this.attachmentFiles, (attachment, i) => {
          this.clientService.uploadProfileAttachment(this.user.id, this.attachmentKeys[i], attachment).then(
            ok => {
              ok ? resolve(true) : resolve(false);
            },
            err => {
              reject(err);
            }
          );
        });
      }
      else {
        resolve(true);
      }
    });
  }

  prepareUpdatedData(updated_data: any) {
    const keys = Object.keys(updated_data);

    _.forEach(keys, (key) => {
      delete this.userData[key];
    });

    _.forEach(keys, (key) => {
      this.userData[key] = updated_data[key];
    });

    console.log(';final_data;');
    console.log(JSON.stringify(this.userData));

    return this.userData;
  }

  updateData() {
    this.updating = true;
    console.log('is submitting');
    const updated_data = this.getAllClientProfileData();
    const prepared_data = this.prepareUpdatedData(JSON.parse(updated_data));
    this.clientService.editProfile(this.user.id, prepared_data).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          console.log('uploading attachment has started');
          this.updateAttachments().then(
            ok => {
              if (ok) {
                this.updating = false;
                this.showUpdatedDialog(true);
              }
              else {
                this.updating = false;
                this.showUpdatedDialog(false);
              }
            }
          );
        }
        else {
          this.updating = false;
          this.showUpdatedDialog(false);
        }
      },
      err => {
        this.updating = false;
        this.showUpdatedDialog(false);
      }
    );
  }

  delete(url: string, key: string, index: number) {
    this.deleting = true;
    this.modalService.open(this.deleteFileDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.clientService.deleteProfileAttachment(this.user.id, key, url).then(
            ok => {
              if (ok) {
                console.log('deleted');
                this.deleting = false;
                this.existingAttachments.splice(index, 1);
              }
              else {
                console.log('deleted');
                this.deleting = false;
                alert('Failed to delete attachment. Please try again!');
              }
            },
            err => {
              console.log('error deleting file');
              this.deleting = false;
              alert('Failed to delete attachment. Please try again!');
            }
          );
        }
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

  save() {
    this.updateData();
  }

  cancel() {
    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.discardChanges();
        }
      }
    );
  }

  downloadDoc(url: string) {
    this.docDialogRef.close();
    this.downloadService.download(url);
  }

  download(url: string) {
    const file_url = this.endpointService.apiHost + 'storage/attachments/' + url;
    this.downloadService.download(file_url);
  }

  discardChanges() {
    this.getAllClientData();
  }

  retry() {
    this.getAllClientData();
  }

  exit() {
    !_.isUndefined(this.setPinDialogRef) ? this.setPinDialogRef.close() : null;
    !_.isUndefined(this.pinDialogRef) ? this.pinDialogRef.close() : null;
    window.history.back();
  }

  reload() {
    this.formFiles = 0;
    this.attachmentKeys = [];
    this.allFormSections = [];
    this.attachmentFiles = [];
    this.duplicateFields = [];
    this.existingAttachments = [];
    this.user = this.localStorage.getUser();
    this.getAllFormSections();
    console.log('reload');
  }

  returnZero() {
    return 0;
  }

}
