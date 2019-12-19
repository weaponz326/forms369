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
    this.resolveReloadDataLoss();
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

  print() {
    this.router.navigateByUrl('/front_desk/print_form', { state: { form: this.form }});
  }

  download() {}
}
