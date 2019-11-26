import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';

@Component({
  selector: 'app-front-desk-view-form-page',
  templateUrl: './front-desk-view-form-page.component.html',
  styleUrls: ['./front-desk-view-form-page.component.css']
})
export class FrontDeskViewFormPageComponent implements OnInit {

  form: any;
  user: Users;
  formName: string;
  loading: boolean;
  formInstance: any;
  formRenderer: any;
  hasError: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.form = window.history.state.form;
    this.user = this.localStorage.getUser();
    this.formName = this.form.form_name;
    console.log('form: ' + JSON.stringify(this.form));
  }

  ngOnInit() {
    this.renderForm();
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('form-render');
    const renderOptions = { formData, dataType: 'json '};
    this.formInstance = $(this.formRenderer).formRender(renderOptions);

    this.setFormData(formData);
  }

  setFormData(data: any) {
    const client_data = this.form.client_submitted_details;
    this.frontDeskService.setFormWithClientData(data, client_data);
  }

  complete() {
    this.loading = true;
    this.frontDeskService.completeForm(this.form.submitted_code).then(
      res => {
        const response = res as any;
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
        this.loading = false;
        this.submitted = false;
        this.hasError = true;
      }
    );
  }

  process() {
    this.loading = true;
    this.frontDeskService.processForm(this.form.submitted_code).then(
      res => {
        const response = res as any;
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
        this.loading = false;
        this.submitted = false;
        this.hasError = true;
      }
    );
  }

  cancel() {}

}
