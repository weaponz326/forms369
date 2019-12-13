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

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
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
    this.formBuilderService.generateSectionAndDefaultFormFields().then(
      form_elements => {
        this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
          controlPosition: 'left',
          inputSets: form_elements,
          scrollToFieldOnAdd: false,
          defaultFields: this._form.form_fields,
          disabledActionButtons: ['data', 'clear', 'save'],
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
      name: [this._form.name, Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getTemplate() {
    return this.formBuilder.actions.getData();
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
        name: this.f.name.value,
        form_fields: template
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
    this.router.navigateByUrl('templates/details/form', { state: { form: this._form }});
  }

  bringBackForm() {
    this.router.navigateByUrl('templates/create');
  }

}
