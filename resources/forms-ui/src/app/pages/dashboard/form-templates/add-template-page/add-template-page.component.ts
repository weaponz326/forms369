import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
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
  allCategoryList: Array<any>;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private templateService: TemplatesService,
    private formBuilderService: FormBuilderService
  ) {
    this.allCategoryList = [];
    this.getCategories();
  }

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
      name: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getTemplate() {
    return this.formBuilder.actions.getData();
  }

  showEmptyFieldsAlert() {
    Swal.fire({
      title: 'Empty Fields',
      icon: 'error',
      text: 'Form fields cannot be empty',
      confirmButtonText: 'Ok, Got it'
    });
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

  save() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const template = this.getTemplate();
    if (template.length == 0) {
      this.loading = false;
      this.showEmptyFieldsAlert();
    }
    else {
      const templateData = {
        form_fields: template,
        name: this.f.name.value,
        category_id: this.f.category.value
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
  }

  reset() {
    this.submitted = false;
    this.formBuilder.actions.clearFields();
  }

  create() {
    this.submitted = true;
    if (this.form.valid) {
      this.save();
    }
  }

  createNew() {
    this.reset();
    this.form.reset();
    this.created = !this.created;
  }

  preview() {
    this.router.navigateByUrl('/templates/view', { state: { form: this.templateForm }});
  }

}
