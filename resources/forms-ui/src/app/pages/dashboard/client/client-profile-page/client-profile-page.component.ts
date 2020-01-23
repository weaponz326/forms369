import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { SectionsService } from 'src/app/services/sections/sections.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FileUploadsService } from 'src/app/services/file-uploads/file-uploads.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-client-profile-page',
  templateUrl: './client-profile-page.component.html',
  styleUrls: ['./client-profile-page.component.css']
})
export class ClientProfilePageComponent implements OnInit {
  user: any;
  imgUrl: string;
  formFiles: number;
  hasData: boolean;
  hasFile: boolean;
  loading: boolean;
  deleting: boolean;
  updating: boolean;
  allUserData: any;
  hasError: boolean;
  documentUrl: string;
  alert_title: string;
  noFilledData: boolean;
  alert_message: string;
  showAttachments: boolean;
  docDialogRef: NgbModalRef;
  loadingAttachments: boolean;
  allFormSections: Array<any>;
  attachmentFiles: Array<File>;
  attachmentKeys: Array<string>;
  existingAttachments: Array<any>;
  @ViewChild('updated', { static: false }) updatedDialog: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;
  @ViewChild('viewImgAttachment', { static: false }) viewImgDialog: TemplateRef<any>;
  @ViewChild('viewDocAttachment', { static: false }) viewDocDialog: TemplateRef<any>;
  @ViewChild('deleteAttachment', { static: false }) deleteFileDialog: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private clientService: ClientService,
    private sectionService: SectionsService,
    private formBuilder: FormBuilderService,
    private endpointService: EndpointService,
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
    private fileUploadService: FileUploadsService
  ) {
    this.formFiles = 0;
    this.attachmentKeys = [];
    this.allFormSections = [];
    this.attachmentFiles = [];
    this.existingAttachments = [];
    this.user = this.localStorage.getUser();
    console.log('user_id: ' + this.user.id);
  }

  ngOnInit() {
    this.getAllFormSections();
  }

  showUpdatedDialog(isSuccess: boolean) {
    if (isSuccess) {
      this.alert_title = 'Profile Updated Successfully';
      this.alert_message = 'You have successfully updated your account data';
      this.modalService.open(this.updatedDialog, { centered: true });
    }
    else {
      this.alert_title = 'Profile Update Failed';
      this.alert_message = 'An error occured updating your account data. Our servers may be down or you dont have an active internet connection.';
      this.modalService.open(this.updatedDialog, { centered: true });
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
        };
      }
    });
  }

  checkIfHasFileUpload(form_data: Array<HTMLInputElement>) {
    _.forEach(form_data, (fields) => {
      if (fields.type == 'file') {
        this.hasFile = true;
        this.formFiles += 1;
        this.attachmentKeys.push(fields.name);
      }
    });
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

   getExistingAttachments() {
    // get all keys for files attachments
    const file_input_fields: Array<HTMLInputElement> = [];
    const file_fields_with_data: Array<HTMLInputElement> = [];
    const file_fields_without_data: Array<HTMLInputElement> = [];

    const all_inputs = document.querySelectorAll('input');
    _.forEach(all_inputs, (input) => {
      if (input.type == 'file') {
        file_input_fields.push(input);
      }
    });

    this.checkIfHasFileUpload(file_input_fields);

    // get all keys and file data for file fields containing data.
    _.forEach(file_input_fields, (file_input) => {
      if (file_input.value != '') {
        console.log('have data: ' + file_input);
        file_fields_with_data.push(file_input);
      }
      else {
        console.log('have no data: ');
        file_fields_without_data.push(file_input);
      }
    });

    return {
     fieldsWithData: file_fields_with_data,
     fieldsWithoutData: file_fields_without_data
   };
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

    console.log('submitted_data: ' + user_form_data['d-o-b']);
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
          this.allFormSections = this.removeDuplicateFormFields(this.allFormSections);
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

  removeDuplicateFormFields(arrayFields: Array<any>) {
    if (arrayFields.length > 1) {
      arrayFields = arrayFields.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.name === item.name
        ))
      );
      return arrayFields;
    }
    else {
      return arrayFields;
    }
  }

  deleteExistingAttachment(key: string) {
    _.forEach(this.existingAttachments, (attachment) => {
      if (attachment.key == key) {
        this.clientService.deleteProfileAttachment(this.user.id, key, attachment.url).then(
          ok => {
            if (ok)
              console.log('deleted');
            else
              console.log('deleted');
          },
          err => {
            console.log('error deleting file');
          }
        );
      }
    });
  }

  uploadAttachmentFile(key: string, index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('uploading .......');
      this.clientService.uploadProfileAttachment(this.user.id.toString(), key, this.attachmentFiles[index - 1]).then(
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

  uploadNormalAttachments(htmlInputField: HTMLInputElement, index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('doing upload');
      this.uploadAttachmentFile(htmlInputField.id, index).then(
        ok => {
          ok ? resolve(true) : resolve(false);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  uploadConvertedAttachment(key: string, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('doing existing upload [converted]');
      console.log(file);
      if (!_.isUndefined(file) || !_.isNull(file)) {
        // this.deleteExistingAttachment(key);
        this.clientService.uploadProfileAttachment(this.user.id.toString(), key, file).then(
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
      }
    });
  }

  updateAttachments(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = [];
      const fields_with_data = this.getExistingAttachments().fieldsWithData;
      const fields_without_data = this.getExistingAttachments().fieldsWithoutData;

      console.log('fields with data length: ' + fields_with_data.length);
      console.log('fields without data length: ' + fields_without_data.length);
      if (fields_with_data.length != 0) {
        console.log('have fields with data');
        if (fields_without_data.length != 0) {
          console.log('have fields without data 1');
          if (this.existingAttachments.length > 0) {
            _.forEach(this.existingAttachments, (attachment, _i) => {
              _.forEach(fields_with_data, (field, i) => {
                console.log('field id: ' + field.id);
                console.log('existing id: ' + attachment.key);
                i += 1;
                if (field.id == attachment.key) {
                  console.log('fields with data doing upload');
                  const index = attachment.url.lastIndexOf('.');
                  const extension = attachment.url.substr(index);
                  const filename = Date.now().toString() + extension;
                  const fileHost = this.endpointService.storageHost + 'attachments/';
                  const p = this.fileUploadService.srcToBase64(fileHost + attachment.url);
                  // alert(attachment.key);
                  this.deleteExistingAttachment(attachment.key);
                  p.then(
                    base64Str => {
                      const fileObj = this.fileUploadService.convertBase64ToFile(base64Str, filename);
                      const _prom = this.uploadConvertedAttachment(attachment.key, fileObj);
                      promises.push(_prom);
                    }
                  );
                }
                else {
                  console.log('its the else');
                  const prom = this.uploadNormalAttachments(field, i);
                  promises.push(prom);
                }

                if (i == fields_with_data.length) {
                  // we assume the fields with data have all been uploaded
                  // Now we handle the fields without data.
                  _.forEach(fields_without_data, (_field) => {
                    console.log('fields without data doing upload');
                    _i += 1;

                    if (_i == fields_without_data.length) {
                      // we assume its done.
                      Promise.all(promises).then(
                        res => {
                          console.log('all uploads completed 1');
                          resolve(true);
                        },
                        err => {
                          console.log('all uploads error');
                          reject(err);
                        }
                      );
                    }
                  });
                }
              });
            });
          }
          else {
            console.log('just upload file');
            console.log('fields with Data: ' + JSON.stringify(fields_with_data));
            console.log('dealing with fields with data only');
            _.forEach(fields_with_data, (field, i) => {
              // alert(field);
              i += 1;
              const prom = this.uploadNormalAttachments(field, i);
              promises.push(prom);

              if (i == fields_with_data.length) {
                // we assume its done.
                Promise.all(promises).then(
                  res => {
                    console.log('all uploads completed 2');
                    resolve(true);
                  },
                  err => {
                    console.log('all uploads error');
                    reject(err);
                  }
                );
              }
            });
          }
        }
        else {
          console.log('fields with Data: ' + JSON.stringify(fields_with_data));
          console.log('dealing with fields with data only');
          _.forEach(fields_with_data, (field, i) => {
            const prom = this.uploadNormalAttachments(field, i);
            promises.push(prom);

            if (i == fields_without_data.length) {
              // we assume its done.
              Promise.all(promises).then(
                res => {
                  console.log('all uploads completed 2');
                  resolve(true);
                },
                err => {
                  console.log('all uploads error');
                  reject(err);
                }
              );
            }
          });
        }
      }
      else {
        console.log('have fields without data 2');
        resolve(true);
      }
    });
  }

  updateData() {
    this.updating = true;
    console.log('is submitting');
    const updatedUserData = this.getAllClientProfileData();
    this.clientService.editProfile(this.user.id, JSON.parse(updatedUserData)).then(
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

  returnZero() {
    return 0;
  }

}
