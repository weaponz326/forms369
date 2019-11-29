import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Users } from 'src/app/models/users.model';
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
  formInstance: any;
  formRenderer: any;
  clientProfile: any;
  formGenCode: string;

  constructor(
    private router: Router,
    private clipboard: ClipboardService,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService
  ) {
    this.form = history.state.form;
    this.user = this.localStorage.getUser();
    console.log('form: ' + JSON.stringify(this.form));
  }

  ngOnInit() {
    this.renderForm();
  }

  renderForm() {
    const formData = this.form.form_fields;
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

  submit() {
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
        },
        err => {
          this.loading = false;
        }
      );
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
