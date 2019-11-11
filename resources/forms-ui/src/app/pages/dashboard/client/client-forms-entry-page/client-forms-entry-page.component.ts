import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { Users } from 'src/app/models/users.model';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

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
  formGenCode: string;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService
  ) {
    this.user = this.localStorage.getUser();
    this.form = this.router.getCurrentNavigation().extras.state.form;
    console.log('form: ' + JSON.stringify(this.form.form_fields));
  }

  ngOnInit() {
    this.renderForm();
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json '};
    this.formInstance = $(this.formRenderer).formRender(renderOptions);
  }

  getFormData() {
    return this.formInstance.userData;
  }

  submit() {
    this.loading = true;
    const user_data = this.getFormData();
    console.log(JSON.stringify(user_data));
    this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, user_data).then(
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
