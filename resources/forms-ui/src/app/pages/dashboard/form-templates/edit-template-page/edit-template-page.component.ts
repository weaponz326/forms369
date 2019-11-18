import { Component, OnInit, Inject } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Forms } from 'src/app/models/forms.model';
import { PageScrollService } from 'ngx-page-scroll-core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';

@Component({
  selector: 'app-edit-template-page',
  templateUrl: './edit-template-page.component.html',
  styleUrls: ['./edit-template-page.component.css']
})
export class EditTemplatePageComponent implements OnInit {

  _form: any;
  form: FormGroup;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  formName: string;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private pageScroller: PageScrollService,
    @Inject(DOCUMENT) private document: any,
    private templateService: TemplatesService,
    private formBuilderService: FormBuilderService
  ) {
    this._form = window.history.state.form;
    console.log(this._form);
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formName = this._form.name;
    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      defaultFields: this._form.form_fields,
      disabledActionButtons: ['data', 'clear', 'save'],
      inputSets: this.formBuilderService.generateFormFields(),
      disableFields: this.formBuilderService.disableDefaultFormControls()
    });
  }

  buildForm() {
    this.form = this._formBuilder.group({
      name: [this._form.name, Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getTemplate() {
    return this.formBuilder.actions.getData();
  }

  scrollToTop() {
    this.pageScroller.scroll({
      document: this.document,
      speed: 1000,
      scrollTarget: '.content-wrapper'
    });
  }

  editForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const template = this.getTemplate();
    const templateData = {};
    templateData.name = this.formName;
    templateData.form_fields = template;

    this.templateService.editTemplate(this._form.id, templateData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this._form = templateData;
        }
        else {
          this.created = false;
        }
      },
      err => {
        this.loading = false;
        this.created = false;
      }
    );
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  edit() {
    if (this.form.valid) {
      this.editForm();
    }
    else {
      this.scrollToTop();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this._form }});
  }

  bringBackForm() {
    this.router.navigateByUrl('git_admin/setup_form');
  }

  goHome() {
    this.router.navigateByUrl('/git_admin');
  }

}
