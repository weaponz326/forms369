import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplatesService } from 'src/app/services/templates/templates.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

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
  hasError: boolean;
  _loading: boolean;
  submitted: boolean;
  allCategoryList: Array<any>;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private templateService: TemplatesService,
    private formBuilderService: FormBuilderService
  ) {
    this._form = window.history.state.form;
    this.resolveReloadDataLoss();
    console.log(this._form);
    this.allCategoryList = [];
    this.getCategories();
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
    if (!_.isUndefined(this._form)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_form', JSON.stringify(this._form));
    }
    else {
      this._form = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formName = this._form.name;
    this.formBuilderService.generateSectionAndDefaultFormFields().then(
      form_elements => {
        this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
          controlPosition: 'left',
          inputSets: form_elements,
          scrollToFieldOnAdd: false,
          defaultFields: this._form.form_fields,
          disabledActionButtons: ['data', 'clear', 'save'],
          typeUserAttrs: this.formBuilderService.handleFieldsTypeAttrs(),
          typeUserDisabledAttrs: this.formBuilderService.disableFieldAttrs(),
          disableFields: this.formBuilderService.disableDefaultFormControls()
        });
        this._loading = false;
      },
      error => {
        this._loading = false;
        this.hasError = true;
      }
    );
  }

  buildForm() {
    this.form = this._formBuilder.group({
      name: [this._form.name, Validators.required],
      category: [this._form.category_id, Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getTemplate() {
    return this.formBuilder.actions.getData();
  }

  getCategories() {
    this.templateService.getTemplateCategories().then(
      categories => {
        _.forEach(categories, (category) => {
          this.allCategoryList.push(category);
        });
      },
      error => {}
    );
  }

  editForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const template = this.getTemplate();

    if (template.length == 0) {
      this.loading = false;
      alert('Form fields cannot be empty');
    }
    else {
      const templateData = {
        form_fields: template,
        name: this.f.name.value,
        category_id: this.f.category.value
      };

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
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  edit() {
    this.submitted = true;
    if (this.form.valid) {
      this.editForm();
    }
  }

  preview() {
    this.router.navigateByUrl('templates/view', { state: { form: this._form }});
  }

  bringBackForm() {
    this.router.navigateByUrl('templates/create');
  }

}
