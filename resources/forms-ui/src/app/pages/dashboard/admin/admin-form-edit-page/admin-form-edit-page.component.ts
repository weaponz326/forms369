import { Component, OnInit, Inject } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Forms } from 'src/app/models/forms.model';
import { PageScrollService } from 'ngx-page-scroll-core';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-admin-form-edit-page',
  templateUrl: './admin-form-edit-page.component.html',
  styleUrls: ['./admin-form-edit-page.component.css']
})
export class AdminFormEditPageComponent implements OnInit {
  _form: any;
  form: FormGroup;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  formName: string;
  formCode: string;
  formStatus: string;
  submitted: boolean;
  merchant_id: number;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private formService: FormsService,
    private pageScroller: PageScrollService,
    @Inject(DOCUMENT) private document: any,
    private localStorage: LocalStorageService,
    private formBuilderService: FormBuilderService
  ) {
    this._form = window.history.state.form;
    this.merchant_id = this.localStorage.getUser().merchant_id;
    console.log('merchant id: ' + this.merchant_id);
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formName = this._form.name;
    this.formStatus = this._form.status;
    this.formCode = this._form.form_code;

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

  getForm() {
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
    const form = this.getForm();
    const formData = new Forms();
    formData.form_fields = form;
    formData.name = this.f.name.value;
    formData.merchant_id = this.merchant_id;
    formData.form_code = this._form.form_code;
    formData.status = _.toInteger(this.formStatus);

    this.formService.editForm(this._form.form_code, formData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this._form = formData;
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
    this.submitted = true;
    if (this.form.valid) {
      this.editForm();
    }
    else {
      this.scrollToTop();
    }
  }

  preview() {
    this.router.navigateByUrl('admin/details/form', { state: { form: this._form }});
  }

  bringBackForm() {
    this.router.navigateByUrl('admin/create/form');
  }

  goHome() {
    this.router.navigateByUrl('admin');
  }

}
