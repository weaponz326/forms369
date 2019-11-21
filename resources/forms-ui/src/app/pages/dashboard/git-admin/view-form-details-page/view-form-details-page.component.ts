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
  }

  ngOnInit() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('fb-editor');
    const formRenderOpts = { formData, dataType: 'json' };
    $(this.formRenderer).formRender(formRenderOpts);
    this.disableFormFields();
  }

  disableFormFields() {
    this.fBuilderService.disableFormFields(this.form.form_fields);
  }

  edit() {
    this.router.navigateByUrl('git_admin/edit/form/' + this.form.form_code, { state: { form: this.form }});
  }

  download() {}

}
