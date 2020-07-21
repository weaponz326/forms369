declare var $: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Users } from 'src/app/models/users.model';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch/branch.service';
import { ClientService } from 'src/app/services/client/client.service';
import { CompanyBranches } from 'src/app/models/company-branches.model';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { FileUploadsService } from 'src/app/services/file-uploads/file-uploads.service';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-client-forms-entry-page',
  templateUrl: './client-forms-entry-page.component.html',
  styleUrls: ['./client-forms-entry-page.component.css']
})
export class ClientFormsEntryPageComponent implements OnInit, AfterViewInit {

  form: any;
  user: Users;
  imgUrl: string;
  branchId: any;
  status: number;
  pinCode: string;
  loading: boolean;
  saved: boolean;
  created: boolean;
  hasFile: boolean;
  formFiles: number;
  isActive: number;
  formInstance: any;
  formRenderer: any;
  clientProfile: any;
  submitted: boolean;
  isLoading: boolean;
  pinForm: FormGroup;
  documentUrl: string;
  pinMinimum: boolean;
  pinRequired: boolean;
  updateProfile: boolean;
  hasSignature: boolean;
  submissionCode: string;
  branchExtension: string;
  loadingBranches: boolean;
  signatureDataURL: string;
  showAttachments: boolean;
  signaturePadOptions: any;
  requireSignature: boolean;
  docDialogRef: NgbModalRef;
  pinDialogRef: NgbModalRef;
  loadingAttachments: boolean;
  setPinDialogRef: NgbModalRef;
  attachmentFiles: Array<File>;
  attachmentKeys: Array<string>;
  signatureImageUrl: string;
  existingAttachments: Array<any>;
  submissionCodeReplacement: string;
  selectBranchDialogRef: NgbModalRef;
  branchesList: Array<CompanyBranches>;
  @ViewChild('pin', { static: false }) pinDialog: TemplateRef<any>;
  @ViewChild('setPin', { static: false }) setPinDialog: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('signaturePad', { static: false }) signaturePad: SignaturePad;
  @ViewChild('joinQueue', { static: false }) joinQueueDialog: TemplateRef<any>;
  @ViewChild('selectBranch', { static: false }) selectBranchDialog: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;
  @ViewChild('newSubmission', { static: false }) newSubmissionDialog: TemplateRef<any>;
  @ViewChild('submissionOptions', { static: false }) submissionOptions: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private reloader: ReloadingService,
    private clipboard: ClipboardService,
    private clientService: ClientService,
    private branchesService: BranchService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
    private fileUploadService: FileUploadsService
  ) {
    this.status = 0;
    this.pinCode = '';
    this.formFiles = 0;
    this.branchId = '';
    this.branchesList = [];
    this.submissionCode = '';
    this.attachmentKeys = [];
    this.attachmentFiles = [];
    this.signatureImageUrl = '';
    this.existingAttachments = [];
    this.form = history.state.form;
    this.form = this.reloader.resolveDataLoss(this.form);
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
    console.log('submission_code: ' + this.form.submission_code);
    this.requireSignature = this.form.require_signature == 1 ? true : false;

    this.getAttachmentsForCurrentForm(this.user.id.toString());
    this.checkIfUserHasFormPin();
    this.generateSubmissionCode();
  }

  ngOnInit() {
    this.initPinForm();
    this.renderForm();
    this.initSignatureOptions();
  }

  ngAfterViewInit() {
    this.showMerchantBranchesDialog();
  }

  public get f() {
    return this.pinForm.controls;
  }

  initPinForm() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.minLength(4), Validators.required]]
    });
  }

  initSignatureOptions() {
    this.signaturePadOptions = {
      'minWidth': 3,
      'canvasWidth': 800,
      'canvasHeight': 300
    };
  }

  signatureClear() {
    this.signaturePad.clear();
  }

  signatureDrawComplete() {
    console.log(this.signaturePad.toDataURL());
    this.signatureDataURL = this.signaturePad.toDataURL();
  }

  editSignature() {
    this.hasSignature = false;
    this.signatureClear();
  }

  restoreSignature() {
    this.hasSignature = !this.hasSignature;
  }

  generateSubmissionCode() {
    this.clientService.generateFormSubmissionCode().then(
      code => {
        this.submissionCode = code;
      }
    );
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.pin.value)) {
      const value = this.f.pin.value.substring(0, this.f.pin.value.length - 1);
      this.f.pin.setValue(value);
    }
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
    this.clientProfile = this.form.client_submitted_details;
    this.clientService.autoFillFormData(data, this.clientProfile);
  }

  getFormData() {
    return this.formInstance.userData;
  }

  getBranches() {
    this.loadingBranches = true;
    this.branchesService.getAllActiveBranches(this.form.merchant_id).then(
      branches => {
        this.branchesList = branches;
        this.loadingBranches = false;
      },
      error => {
        this.loadingBranches = false;
        console.log('error loading branches');
      }
    );
  }

  chooseBranch(branch_id: number, index: number) {
    this.branchId = branch_id;
    this.isActive = index;
  }

  closeBranchDialog() {
    _.forEach(this.branchesList, (branch) => {
      if (branch.id == this.branchId) {
        this.branchExtension = branch.branch_ext;
      }
    });
    this.branchId == 0 || this.branchId == null
      ? alert('Select a branch to continue')
      : this.selectBranchDialogRef.close();
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
      else {
        if (this.hasSignature) {
          this.hasFile = true;
        }
      }
    });
  }

  checkIfUserHasFormPin() {
    this.clientService.checkFormSubmitPin(this.user.id.toString()).then(
      ok => {
        console.log('res: ' + JSON.stringify(ok));
        if (ok) {
          localStorage.setItem('has_pin', '1');
        }
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
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

  getCurrentFormAttachmentKeys() {
    const fileInputElements = [];
    const inputElements = document.querySelectorAll('input');
    _.forEach(inputElements, (element) => {
      if (element.type == 'file')
        fileInputElements.push(element.name);
    });

    return fileInputElements;
  }

  submitFormAndAttachments(user_data: any, updateProfile: boolean) {
    console.log('is submitting');
    const form_submission_code =
      this.submissionCodeReplacement == null ||
      this.submissionCodeReplacement.length == 0 ||
      this.submissionCodeReplacement == undefined ? this.submissionCode : this.submissionCodeReplacement;
    if (this.hasFile) {
      console.log('__________it has file ....');
      this.uploadFormAttachments(user_data, updateProfile, form_submission_code);
    }
    else {
      console.log('___________it doesnt have file');
      const update = updateProfile ? 1 : 0;
      const filled_data = this.formBuilder.getFormUserData(user_data);
      const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
      this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, form_submission_code, this.status, this.branchId).then(
        ok => {
          if (ok) {
            this.loading = false;
            if (this.status == 0) {
              this.showJoinQueueDialog();
            }
            else {
              this.saved = true;
            }
          }
          else {
            this.loading = false;
          }
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

  showMerchantBranchesDialog() {
    if (this.form.can_view == 0) {
      this.getBranches();
      this.selectBranchDialogRef = this.modalService.open(this.selectBranchDialog, { centered: true, keyboard: false, backdrop: 'static' });
      this.selectBranchDialogRef.result.then(
        result => {
          if (result == 'no') {
            this.selectBranchDialogRef.close();
            window.history.back();
          }
          else {
          }
        }
      );
    }
  }

  showJoinQueueDialog() {
    this.modalService.open(this.joinQueueDialog, { centered: true, backdrop: 'static', keyboard: false });
  }

  queueJoined(data: any) {
    data == true ? this.created = true : this.created = false;
  }

  skipQueue(e: any) {
    console.log('am here');
    this.created = true;
  }

  showMakeNewSubmissionDialog() {
    this.modalService.open(this.newSubmissionDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.modalService.open(this.confirmDialog, { centered: true }).result.then(
            res => {
              if (res == 'yes') {
                this.handlePinCode(true);
              }
              else if (res == 'no') {
                this.handlePinCode(false);
              }
              else {
                this.modalService.dismissAll();
                this.loading = false;
              }
            }
          );
        }
        else {
          this.loading = false;
          this.modalService.dismissAll();
        }
      }
    );
  }

  showSubmissionOptionsDialog(code: string) {
    this.modalService.open(this.submissionOptions, { centered: true }).result.then(
      result => {
        if (result == 'replace') {
          this.submissionCode = code;
          this.submissionCodeReplacement = code;
          this.modalService.open(this.confirmDialog, { centered: true }).result.then(
            res => {
              if (res == 'yes') {
                this.handlePinCode(true);
              }
              else if (res == 'no') {
                this.handlePinCode(false);
              }
              else {
                this.modalService.dismissAll();
                this.loading = false;
              }
            }
          );
        }
        else if (result == 'new') {
          this.modalService.open(this.confirmDialog, { centered: true }).result.then(
            res => {
              if (res == 'yes') {
                this.handlePinCode(true);
              }
              else if (res == 'no') {
                this.handlePinCode(false);
              }
              else {
                this.modalService.dismissAll();
                this.loading = false;
              }
            }
          );
        }
        else {
          this.modalService.dismissAll();
        }
      }
    );
  }

  handlePinCode(update: boolean) {
    this.updateProfile = update;
    const hasPin = localStorage.getItem('has_pin');
    if (_.isNull(hasPin) || _.isUndefined(hasPin)) {
      this.setPinDialogRef = this.modalService.open(this.setPinDialog, { centered: true });
    }
    else {
      this.pinDialogRef = this.modalService.open(this.pinDialog, { centered: true });
    }
  }

  submitForm() {
    this.loading = true;
    // handle signature first
    if (_.isEmpty(this.signatureDataURL)) {
      // signature wasn't changed, still using the same signature.
      this.handleFormSubmission();
    }
    else {
      // signature was changed, we need to handle it.
      const key = 'signature';
      const sigImgFile = this.fileUploadService.convertBase64ToFile(this.signatureDataURL, 'signature.png');
      if (this.updateProfile) {
        this.clientService.uploadProfileAttachment(this.user.id.toString(), key, sigImgFile).then(
          ok => {
            this.handleFormSubmission();
          },
          err => {
            console.log('error uploading signature:update*');
          }
        );
      }
      else {
        // don't update the profile with the new signature
        this.handleFormSubmission();
      }
    }
  }

  handleFormSubmission() {
    const user_data = this.getFormData();
    console.log(JSON.stringify(user_data));
    console.log('this form: ' + this.formBuilder.getFormUserData(user_data));
    const unfilled = this.clientService.validateFormFilled(user_data);
    console.log('unfilled: ' + JSON.stringify(unfilled));
    if (unfilled.length != 0) {
      const fileFields = this.getExistingAttachments(unfilled);
      console.log('fileFields: ' + JSON.stringify(fileFields));
      if (fileFields.length == 0) {
        this.loading = false;
        this.clientService.highlightUnFilledFormFields(unfilled);
      }
      else {
        this.submitFormAndAttachments(user_data, this.updateProfile);
      }
    }
    else {
      this.submitFormAndAttachments(user_data, this.updateProfile);
    }
  }

  submit() {
    this.loading = true;
    const user_id = this.user.id.toString();
    this.clientService.checkSubmittedFormStatus(user_id, this.form.form_code).then(
      res => {
        console.log('success');
        if (res.submitted == 0) {
          this.modalService.open(this.confirmDialog, { centered: true }).result.then(
            result => {
              if (result == 'yes') {
                this.handlePinCode(true);
              }
              else if (result == 'no') {
                this.handlePinCode(false);
              }
              else {
                this.modalService.dismissAll();
                this.loading = false;
              }
            }
          );
        }
        else {
          if (res.status == 0) {
            this.showSubmissionOptionsDialog(res.code);
          }
          else if (res.status == 1) {
            this.showMakeNewSubmissionDialog();
          }
          else {
            this.modalService.open(this.confirmDialog, { centered: true }).result.then(
              result => {
                if (result == 'yes') {
                  this.handlePinCode(true);
                }
                else if (result == 'no') {
                  this.handlePinCode(false);
                }
                else {
                  this.modalService.dismissAll();
                  this.loading = false;
                }
              }
            );
          }
        }
      },
      err => {
        console.log('something went wrong');
      }
    );
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
            this.submitForm();
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

   uploadConvertedFormAttachment(key: string, file: File, user_data: any, updateProfile: boolean, submission_code: string) {
    console.log('doing existing upload');
    console.log('form_code: ' + submission_code);
    console.log('key: ' + key);
    console.log(file);
    if (!_.isUndefined(file) || !_.isNull(file)) {
      this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, submission_code, key, file).then(
        ok => {
          if (!ok) {
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

  uploadFormFile(key: string, user_data: any, updateProfile: boolean, form_submission_code: string, index?: number) {
    if (_.isUndefined(index) || _.isNull(index)) {
      if (this.attachmentFiles.length != 0) {
        this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, form_submission_code, key, this.attachmentFiles[0]).then(
          ok => {
            if (ok) {
              console.log('file upload done');
              const update = updateProfile ? 1 : 0;
              const filled_data = this.formBuilder.getFormUserData(user_data);
              const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
              this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, form_submission_code, this.status, this.branchId).then(
                _ok => {
                  if (_ok) {
                    this.loading = false;
                    this.status == 0 ? this.created = true : this.saved = true;
                  }
                  else {
                    this.loading = false;
                    console.log('form submission failed');
                  }
                },
                err => {
                  this.loading = false;
                  console.log('form submission error 2');
                }
              );
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
        if (this.existingAttachments.length > 0) {
          _.forEach(this.existingAttachments, (attachment, i) => {
            const idx = attachment.url.lastIndexOf('.');
            const extension = attachment.url.substr(idx);
            const filename = Date.now().toString() + extension;
            const attachmentHost = this.endpointService.storageHost + 'attachments/';
            const p = this.fileUploadService.srcToBase64(attachmentHost + attachment.url);
            p.then(
              base64Str => {
                const fileObj = this.fileUploadService.convertBase64ToFile(base64Str, filename);
                this.uploadConvertedFormAttachment(attachment.key, fileObj, user_data, updateProfile, form_submission_code);
              }
            );

            if (i == this.existingAttachments.length - 1) {
              console.log('we done uploading');
              console.log('no upload');
              const update = updateProfile ? 1 : 0;
              const filled_data = this.formBuilder.getFormUserData(user_data);
              const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
              this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, form_submission_code, this.status, this.branchId).then(
                ok => {
                  if (ok) {
                    this.loading = false;
                    this.status == 0 ? this.created = true : this.saved = true;
                  }
                  else {
                    this.loading = false;
                    console.log('form submission failed');
                  }
                },
                err => {
                  this.loading = false;
                  console.log('form submission error 3');
                }
              );
            }
          });
        }
      }
    }
    else {
      // its being called in a loop, this means there are more than one attachments.
      this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, form_submission_code, key, this.attachmentFiles[index]).then(
        ok => {
          if (ok) {
            console.log('file upload done');
            const update = updateProfile ? 1 : 0;
            const filled_data = this.formBuilder.getFormUserData(user_data);
            const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
            this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, form_submission_code, this.status, this.branchId).then(
              _ok => {
                if (_ok) {
                  this.loading = false;
                  this.status == 0 ? this.created = true : this.saved = true;
                }
                else {
                  this.loading = false;
                  console.log('form submission failed');
                }
              },
              err => {
                this.loading = false;
                console.log('form submission error 4');
              }
            );
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

  updateSignature(updateProfile: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(this.signatureDataURL)) {
        console.log('no signature was signed');
        resolve(true);
      }
      else {
        console.log('now uploading a new signature that was signed');
        const key = 'signature';
        const signatureImageFile = this.fileUploadService.convertBase64ToFile(this.signatureDataURL, 'signature.png');
        this.clientService.uploadProfileAttachment(this.user.id.toString(), key, signatureImageFile).then(
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

  existingUpload(user_data: any, updateProfile: boolean, submission_code: string) {
    _.forEach(this.existingAttachments, (attachment, i) => {
      const idx = attachment.url.lastIndexOf('.');
      const extension = attachment.url.substr(idx);
      const filename = Date.now().toString() + extension;
      const attachmentHost = this.endpointService.storageHost + 'attachments/';
      const p = this.fileUploadService.srcToBase64(attachmentHost + attachment.url);
      p.then(
        base64Str => {
          const fileObj = this.fileUploadService.convertBase64ToFile(base64Str, filename);
          this.uploadConvertedFormAttachment(attachment.key, fileObj, user_data, updateProfile, submission_code);
        }
      );

      const sigImgFile = this.fileUploadService.convertBase64ToFile(this.signatureDataURL, 'signature.png');
      this.uploadConvertedFormAttachment('signature', sigImgFile, user_data, updateProfile, submission_code);
      alert('______________uploading_________: ');

      if (i == this.existingAttachments.length - 1) {
        console.log('we done uploading');
        console.log('no upload');
        const update = updateProfile ? 1 : 0;
        const filled_data = this.formBuilder.getFormUserData(user_data);
        const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
        this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, submission_code, this.status, this.branchId).then(
          ok => {
            if (ok) {
              this.loading = false;
              this.status == 0 ? this.created = true : this.saved = true;
            }
            else {
              this.loading = false;
              console.log('form submission failed');
            }
          },
          err => {
            this.loading = false;
            console.log('form submission error 5');
          }
        );
      }
    });
  }

  uploadFormAttachments(user_data: any, updateProfile: boolean, submission_code: string) {
    // we can tell the number of attachments this form has by
    // checking the formFiles variable's value.
    console.log('doing upload');
    const num_of_attachments = this.formFiles;

    // upload signature
    const key = 'signature';
    const sigImgFile = this.fileUploadService.convertBase64ToFile(this.signatureDataURL, 'signature.png');
    this.clientService.uploadFormAttachments(this.user.id.toString(), this.form.form_code, submission_code, key, sigImgFile).then(
      done => {
        if (done) {
          if (num_of_attachments > 1) {
            console.log('will do multiple uploads');
            for (let i = 0; i < num_of_attachments; i++) {
              this.uploadFormFile(this.attachmentKeys[i], user_data, updateProfile, submission_code, i);
            }
          }
          else {
            console.log('will do single upload');
            console.log('attachments length: ' + this.attachmentFiles.length);
            if (this.attachmentFiles.length == 0) {
              console.log('no attachment');
              if (this.existingAttachments.length > 0) {
                this.existingUpload(user_data, updateProfile, submission_code);
              }
              else {
                const update = updateProfile ? 1 : 0;
                const filled_data = this.formBuilder.getFormUserData(user_data);
                const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile);
                this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile, JSON.parse(updated_data), update, submission_code, this.status, this.branchId).then(
                  ok => {
                    if (ok) {
                      this.loading = false;
                      if (this.status == 0) {
                        this.showJoinQueueDialog();
                      }
                      else {
                        this.saved = true;
                      }
                    }
                    else {
                      this.loading = false;
                      console.log('form submission failed');
                    }
                  },
                  err => {
                    this.loading = false;
                    console.log('form submission error 6');
                  }
                );
              }
            }
            else {
              console.log('has attachment');
              this.uploadFormFile(this.attachmentKeys[0], user_data, updateProfile, submission_code);
            }
          }
        }
      },
      err => {}
    );
  }

  // getFormAttachments(form_code: string) {
  //   this.loadingAttachments = true;
  //   console.log('getting form attachments');
  //   this.clientService.getFormAttachment(form_code).then(
  //     res => {
  //       alert('resssss: ' + JSON.stringify(res));
  //       if (res.length > 0) {
  //         this.showAttachments = true;
  //         _.forEach(res, (doc) => {
  //           console.log('doc: ' + JSON.stringify(doc));
  //           if (doc.key == 'signature') {
  //             this.hasSignature = true;
  //             this.signatureImageUrl = this.endpointService.apiHost + '/attachments/' + doc.url;
  //           }
  //           this.existingAttachments.push(doc);
  //         });
  //       }
  //       else {
  //         this.showAttachments =  false;
  //       }

  //       this.loadingAttachments = false;
  //     },
  //     err => {
  //       console.log('get_a_error: ' + JSON.stringify(err));
  //       this.loadingAttachments = false;
  //     }
  //   );
  // }

  getAttachmentsForCurrentForm(user_id: string) {
    console.log('getting attchment for currrent fomr');
    this.loadingAttachments = true;
    this.clientService.getProfileFormAttachment(user_id).then(
      res => {
        console.log('r__sss: ' + JSON.stringify(res));
        if (res.length > 0) {
          const attachments = [];
          _.forEach(res, (doc) => {
            console.log('doc: ' + JSON.stringify(doc));
            if (doc.key == 'signature') {
              this.hasSignature = true;
              this.signatureImageUrl = this.endpointService.storageHost + 'attachments/' + doc.url;
            }
            attachments.push(doc);
          });
          this.getCurrentFormAttachmentsOnly(attachments);
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

  getCurrentFormAttachmentsOnly(attachments: Array<any>) {
    _.forEach(attachments, (attachment) => {
      _.forEach(this.attachmentKeys, (_attachment) => {
        console.log('_aaaaa: ' + _attachment);
        if (attachment.key == _attachment) {
          this.existingAttachments.push(attachment);
        }
      });
    });

    this.existingAttachments.length > 0 ? this.showAttachments = true : null;
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

  saveAsDraft() {
    this.status = 4;
    this.loading = true;

    this.modalService.open(this.confirmDialog, { centered: true }).result.then(
      result => {
        if (result == 'yes') {
          this.updateProfile = true;
          const user_data = this.getFormData();
          console.log(JSON.stringify(user_data));
          console.log('this form: ' + this.formBuilder.getFormUserData(user_data));
          this.submitFormAndAttachments(user_data, this.updateProfile);
        }
        else if (result == 'no') {
          this.updateProfile = false;
          const user_data = this.getFormData();
          console.log(JSON.stringify(user_data));
          console.log('this form: ' + this.formBuilder.getFormUserData(user_data));
          this.submitFormAndAttachments(user_data, this.updateProfile);
        }
        else {
          this.loading = false;
        }
      }
    );
  }

  copy() {
    this.clipboard.copyFromContent(this.submissionCode);
  }

  cancel() {
    window.history.back();
  }

  ok() {
    this.router.navigateByUrl('/client/forms_filled');
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
