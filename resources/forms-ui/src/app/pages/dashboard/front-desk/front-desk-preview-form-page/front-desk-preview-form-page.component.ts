declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';

@Component({
  selector: 'app-front-desk-preview-form-page',
  templateUrl: './front-desk-preview-form-page.component.html',
  styleUrls: ['./front-desk-preview-form-page.component.css']
})
export class FrontDeskPreviewFormPageComponent implements OnInit {
  form: any;
  formRenderer: any;

  constructor(
    private router: Router,
    private frontDeskService: FrontDeskService,
    private fBuilderService: FormBuilderService
  ) {
    this.form = window.history.state.form;
  }

  ngOnInit() {
    this.renderForm();
  }

  renderForm() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('fb-editor');
    const formRenderOpts = { formData, dataType: 'json' };
    $(this.formRenderer).formRender(formRenderOpts);
    this.disableFormFields();

    this.setFormData(formData);
  }

  setFormData(data: any) {
    const client_data = this.form.client_submitted_details;
    this.frontDeskService.setFormWithClientData(data, client_data);
  }

  disableFormFields() {
    this.fBuilderService.disableFormFields(this.form.form_fields);
  }

  print() {}

  download() {}
}
