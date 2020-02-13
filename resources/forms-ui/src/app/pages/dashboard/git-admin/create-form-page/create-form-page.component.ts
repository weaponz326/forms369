import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-create-form-page',
  templateUrl: './create-form-page.component.html',
  styleUrls: ['./create-form-page.component.css']
})
export class CreateFormPageComponent implements OnInit {

  pdfFile: File;
  template: any;
  form: FormGroup;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  formName: string;
  formCode: string;
  hasError: boolean;
  submitted: boolean;
  toPublish: boolean;
  uploadError: boolean;
  showFileUpload: boolean;
  allMerchantsList: Array<any>;
  @ViewChild('pdfFile', { static: false }) pdfFileElement: ElementRef;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private formService: FormsService,
    private companyService: CompanyService,
    private formBuilderService: FormBuilderService
  ) {
    this.template = window.history.state.template;
    this.allMerchantsList = [];
    this.getCompanies();
  }

  renderForm() {
    if (_.isUndefined(this.template) || _.isNull(this.template)) {
      this.formBuilderService.generateFormFieldsBySections().then(
        form_elements => {
          this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
            controlPosition: 'left',
            inputSets: form_elements,
            scrollToFieldOnAdd: false,
            disabledActionButtons: ['data', 'clear', 'save'],
            typeUserAttrs: this.formBuilderService.handleFieldsTypeAttrs(),
            typeUserDisabledAttrs: this.formBuilderService.disableFieldAttrs(),
            disableFields: this.formBuilderService.disableSectionFormFields()
          });
          this._loading = false;
        },
        error => {
          this._loading = false;
          this.hasError = true;
        }
      );
    }
    else {
      this.formCode = this.formBuilderService.generateUniqueFormCode();
      this.formBuilderService.generateSectionAndDefaultFormFields().then(
        form_elements => {
          this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
            controlPosition: 'left',
            inputSets: form_elements,
            scrollToFieldOnAdd: false,
            defaultFields: this.template.form_fields,
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
  }

  ngOnInit() {
    this.created = false;
    this._loading = true;
    this.buildForm();
    this.renderForm();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      pdf: [''],
      canView: [''],
      name: ['', Validators.required],
      merchant: ['', Validators.required]
    });
  }

  public get f() {
    return this.form.controls;
  }

  public get _merchant() {
    return this.form.get('merchant');
  }

  onMerchantSelect(e: any) {
    this._merchant.setValue(e.target.value, {
      onlySelf: true
    });
    this.handleUploadFileView(this.f.merchant.value);
  }

  inputFileChanged(ev: Event) {
    const pdf_file = this.pdfFileElement.nativeElement as HTMLInputElement;
    this.f.pdf.setValue(pdf_file.files[0].name);
    this.pdfFile = pdf_file.files[0];
  }

  showFilePicker() {
    const element = this.pdfFileElement.nativeElement as HTMLInputElement;
    element.click();
  }

  handleUploadFileView(merchant_id: string) {
    console.log('handling can upload view');
    _.forEach(this.allMerchantsList, (merchant, i) => {
      if (merchant_id == merchant.id) {
        console.log('gotIT: ' + merchant.can_print);
        this.showFileUpload = merchant.can_print == 1 ? true : false;
        return;
      }
    });
  }

  getCompanies() {
    this._loading = true;
    this.companyService.getAllCompanyCollection().then(
      res => {
        console.log('all_comps: ' + JSON.stringify(res));
        const merchants = res as any;
        merchants.forEach((merchant: any) => {
          this.allMerchantsList.push(merchant);
        });
        this._loading = false;
      },
      err => {
        this._loading = false;
        console.log('err_comps: ' + JSON.stringify(err));
      }
    );
  }

  getForm() {
    return this.formBuilder.actions.getData();
  }

  createForm() {
    const form = this.getForm();
    const formData = new Forms();
    console.log('json: ' + JSON.stringify(form));

    if (form.length == 0) {
      alert('Form fields cannot be empty');
      this.loading = false;
    }
    else {
      formData.form_fields = form;
      formData.name = this.f.name.value;
      formData.form_code = this.formCode;
      formData.status = this.toPublish ? 1 : 0;
      formData.merchant_id = parseInt(this.f.merchant.value);
      formData.can_view = this.f.canView.value == '' ? 0 : this.f.canView.value;

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
  }

  createFormWithPDF() {
    this.toPublish = false;
    if (this.getForm().length == 0) {
      this.loading = false;
      alert('Form field cannot be empty');
    }
    else {
      this.formService.uploadFormPDF(this.f.merchant.value, this.formCode, this.pdfFile).then(
        res => {
          this.createForm();
        },
        err => {
          this.loading = false;
          this.created = false;
          this.uploadError = true;
        }
      );
    }
  }

  save() {
    this.loading = true;
    this.pdfFile == null ? this.createForm() : this.createFormWithPDF();
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  create() {
    this.submitted = true;
    this.toPublish = false;
    this.formCode = this.formBuilderService.generateUniqueFormCode();
    if (this.showFileUpload) {
      if (this.form.valid) {
        this.save();
      }
    }
    else {
      // remove pdf validations
      console.log('no upload');
      this.f.pdf.clearValidators();
      this.f.pdf.updateValueAndValidity();

      if (this.form.valid) {
        this.save();
      }
    }
  }

  publish() {
    this.loading = true;
    this.submitted = true;
    this.toPublish = true;
    this.formCode = this.formBuilderService.generateUniqueFormCode();

    // remove pdf validations
    this.f.pdf.clearValidators();
    this.f.pdf.updateValueAndValidity();

    if (this.form.valid) {
      console.log('form is valid');
      this.createForm();
    }
    else {
      this.loading = false;
      this.toPublish = false;
      console.log('form not valid');
    }
  }

  preview() {
    const form_data = { name: this.f.name.value, form_fields: this.getForm() };
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: form_data }});
  }

  bringBackForm() {
    this.reset();
    this.submitted = false;
    this.f.pdf.setValue('');
    this.f.name.setValue('');
    this.f.canView.setValue('');
    this.f.merchant.setValue('');
    this.created = !this.created;
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/form');
  }

  ok1() {
    this.uploadError = false;
    this.created = !this.created;
  }

  retry() {
    this.uploadError = false;
    this.save();
  }

}
