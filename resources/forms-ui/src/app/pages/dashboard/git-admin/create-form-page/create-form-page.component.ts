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
    this.allMerchantsList = [];
    this.getCompanies();
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
      pdf: [''],
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
      alert('Form field cannot be empty');
    }
    else {
      this.formService.uploafFormPDF(this.f.merchant.value, this.formCode, this.pdfFile).then(
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
    this.formCode = this.formBuilderService.generateUniqueFormCode();
    this.submitted = true;
    this.toPublish = false;
    if (this.showFileUpload) {
      if (this.form.valid) {
        this.save();
      }
    }
    else {
      // remove pdf validations
      this.f.pdf.clearValidators();
      this.f.pdf.updateValueAndValidity();

      if (this.form.valid) {
        this.save();
      }
    }
  }

  publish() {
    this.formCode = this.formBuilderService.generateUniqueFormCode();
    this.submitted = true;
    this.toPublish = true;

    // remove pdf validations
    this.f.pdf.clearValidators();
    this.f.pdf.updateValueAndValidity();

    if (this.form.valid) {
      this.createForm();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this.getForm() }});
  }

  bringBackForm() {
    this.reset();
    this.submitted = false;
    this.f.pdf.setValue('');
    this.f.name.setValue('');
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
