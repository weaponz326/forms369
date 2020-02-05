import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-view-form-details-page',
  templateUrl: './view-form-details-page.component.html',
  styleUrls: ['./view-form-details-page.component.css']
})
export class ViewFormDetailsPageComponent implements OnInit {

  form: any;
  formRenderer: any;

  constructor(
    private router: Router,
    private fBuilderService: FormBuilderService
  ) {
    this.form = window.history.state.form;
    console.log('this.name: ' + this.form.name);
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
    const formData = this.form.form_fields || this.form;
    this.formRenderer = document.getElementById('fb-editor');
    const formRenderOpts = { formData, dataType: 'json' };
    $(this.formRenderer).formRender(formRenderOpts);
    this.disableFormFields();
  }

  disableFormFields() {
    this.fBuilderService.disableFormFields(this.form.form_fields);
  }

  edit() {
    this.router.navigateByUrl('git_admin/edit/form', { state: { form: this.form }});
  }

  download() {}

}
