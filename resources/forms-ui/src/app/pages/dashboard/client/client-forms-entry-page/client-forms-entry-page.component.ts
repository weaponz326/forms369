import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Users } from 'src/app/models/users.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
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
  loading: boolean;
  created: boolean;
  hasFile: boolean;
  formFiles: number;
  formInstance: any;
  formRenderer: any;
  clientProfile: any;
  formGenCode: string;
  @ViewChild('confirm', { static: false }) confirmDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalServiuce: NgbModal,
    private clipboard: ClipboardService,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService
  ) {
    this.formFiles = 0;
    this.form = history.state.form;
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
  }

  ngOnInit() {
    this.renderForm();
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.checkIfHasFileUpload(formData);
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json' };
    this.formInstance = $(this.formRenderer).formRender(renderOptions);

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

  checkIfHasFileUpload(form_data) {
    _.forEach(form_data, (fields) => {
      if (fields.name == 'file') {
        this.hasFile = true;
        this.formFiles += 1;
      }
    });
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
            this.loading = false;
            console.log('unfilled: ' + JSON.stringify(unfilled));
            this.clientService.highlightUnFilledFormFields(unfilled);
          }
          else {
            console.log('is submitting');
            const filled_data = this.formBuilder.getFormUserData(user_data);
            const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.clientProfile.client_details[0]);
            console.log('new updates: ' + updated_data);
            this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.clientProfile.client_details[0], JSON.parse(updated_data)).then(
              res => {
                this.created = true;
                this.loading = false;
                this.formGenCode = res.code;
                // if (this.hasFile) {
                //   this.uploadFormAttachments();
                // }
              },
              err => {
                this.loading = false;
              }
            );
          }
        }
      }
    );
  }

  uploadFormAttachments() {
    // we can tell the number of attachments this form has by
    // checking the formFiles variable's value.
    const num_of_attachments = this.formFiles;
    if (num_of_attachments > 1) {
      for (let i = 0; i < num_of_attachments; i++) {
        this.clientService.uploadFormAttachments(
          this.user.id.toString(),
          this.form.form_code,
          this.formGenCode, null
        ).then(
          ok => {
            if (ok) {
              this.created = true;
              this.loading = false;
            }
          },
          err => {
            this.loading = false;
          }
        );
      }
    }
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

}
