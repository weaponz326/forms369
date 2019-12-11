import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplatesService } from 'src/app/services/templates/templates.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-add-template-page',
  templateUrl: './add-template-page.component.html',
  styleUrls: ['./add-template-page.component.css']
})
export class AddTemplatePageComponent implements OnInit {

  form: FormGroup;
  formName: string;
  formBuilder: any;
  templateForm: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  hasError: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private templateService: TemplatesService,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit() {
    this.created = false;
    this._loading = true;
    this.buildForm();

    this.formBuilderService.generateSectionAndDefaultFormFields().then(
      form_elements => {
        this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
          controlPosition: 'left',
          inputSets: form_elements,
          scrollToFieldOnAdd: false,
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
      name: ['', Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getTemplate() {
    return this.formBuilder.actions.getData();
  }

  save() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const template = this.getTemplate();
    const templateData = {
      name: this.f.name.value,
      form_fields: template
    };

    console.log(templateData);
    this.templateService.createTemplate(templateData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this.templateForm = templateData;
          this.formName = templateData.name;
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

  create() {
    this.submitted = true;
    if (this.form.valid) {
      this.save();
    }
  }

  createNew() {
    this.formBuilder.actions.clearFields();
    this.created = false;
    this.form.reset();
  }

  preview() {
    this.router.navigateByUrl('/templates/view', { state: { form: this.templateForm }});
  }

}
