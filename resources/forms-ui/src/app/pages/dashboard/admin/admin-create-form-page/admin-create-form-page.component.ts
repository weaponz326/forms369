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
  selector: 'app-admin-create-form-page',
  templateUrl: './admin-create-form-page.component.html',
  styleUrls: ['./admin-create-form-page.component.css']
})
export class AdminCreateFormPageComponent implements OnInit {
  form: FormGroup;
  formName: string;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  formCode: string;
  submitted: boolean;
  toPublish: boolean;
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
    this.merchant_id = this.localStorage.getUser().merchant_id;
    console.log('merchant id: ' + this.merchant_id);
  }

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

    this.formCode = this.formBuilderService.generateUniqueFormCode();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  getForm() {
    return this.formBuilder.actions.getData();
  }

  save() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const form = this.getForm();
    const formData = new Forms();
    formData.form_fields = form;
    formData.name = this.f.name.value;
    formData.form_code = this.formCode;
    formData.merchant_id = this.merchant_id;
    formData.status = this.toPublish ? 1 : 0;

    this.formService.createForm(formData).then(
      res => {
        this.loading = false;
        this.toPublish = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this.formName = formData.name;
        }
        else {
          this.created = false;
        }
      },
      err => {
        this.loading = false;
        this.created = false;
        this.toPublish = false;
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

  publish() {
    this.submitted = true;
    if (this.form.valid) {
      this.toPublish = true;
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
    this.created = !this.created;
  }

  preview() {
    this.router.navigateByUrl('/admin/details/form', { state: { form: this.getForm() }});
  }

  goHome() {
    this.router.navigateByUrl('/admin');
  }

}
