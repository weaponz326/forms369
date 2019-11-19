import { Component, OnInit, Inject } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';

@Component({
  selector: 'app-add-template-page',
  templateUrl: './add-template-page.component.html',
  styleUrls: ['./add-template-page.component.css']
})
export class AddTemplatePageComponent implements OnInit {

  form: FormGroup;
  formBuilder: any;
  templateForm: any;
  created: boolean;
  loading: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private pageScroller: PageScrollService,
    @Inject(DOCUMENT) private document: any,
    private templateService: TemplatesService,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      disabledActionButtons: ['data', 'clear', 'save'],
      inputSets: this.formBuilderService.generateFormFields(),
      disableFields: this.formBuilderService.disableDefaultFormControls()
    });
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
    else {
      this.scrollToTop();
    }
  }

  scrollToTop() {
    this.pageScroller.scroll({
      document: this.document,
      speed: 1000,
      scrollTarget: '.content-wrapper'
    });
  }

  bringBackForm() {
    this.router.navigateByUrl('git_admin/setup_form');
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this.templateForm }});
  }

  goHome() {
    this.router.navigateByUrl('/git_admin');
  }

}
