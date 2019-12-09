import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-create-form-page',
  templateUrl: './create-form-page.component.html',
  styleUrls: ['./create-form-page.component.css']
})
export class CreateFormPageComponent implements OnInit {

  form: FormGroup;
  pdfFile: File;
  formBuilder: any;
  filename: string;
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
    private localService: LocalStorageService,
    private formBuilderService: FormBuilderService
  ) {
    this.allMerchantsList = [];
    this.getCompanies();
  }

  ngOnInit() {
    this.created = false;
    this._loading = true;
    this.buildForm();

    this.formBuilderService.generateFormFieldsBySections().then(
      form_elements => {
        this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
          controlPosition: 'left',
          inputSets: form_elements,
          scrollToFieldOnAdd: false,
          disabledActionButtons: ['data', 'clear', 'save'],
          disableFields: this.formBuilderService.disableSectionFormFields()
        });

        this.formCode = this.formBuilderService.generateUniqueFormCode();
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
      pdf: ['', Validators.required],
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
    _.forEach(this.allMerchantsList, (merchant, i) => {
      if (merchant_id == merchant.id) {
        this.showFileUpload = merchant.can_print == 1 ? true : false;
        return;
      }
      else {
        // if its the last item in the array
        if (i == this.allMerchantsList.length) {
          // remove validator set on pdf because pdf isnt going to be
          // uploaded so there is no need to make it required.
          console.log('last in array which isnt can_print');
          this.f.pdf.clearValidators();
          this.f.pdf.updateValueAndValidity();
        }
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

  createFormWithPDF() {
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

  save() {
    this.loading = true;
    this.toPublish = this.showFileUpload ? false : true;
    this.showFileUpload ? this.createFormWithPDF() : this.createForm();
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

  publish() {
    this.submitted = true;
    if (this.form.valid) {
      this.toPublish = true;
      this.save();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this.getForm() }});
  }

  bringBackForm() {
    this.created = !this.created;
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/form');
  }

  ok1() {
    this.created = false;
    this.uploadError = false;
  }

  retry() {
    this.uploadError = false;
    this.save();
  }

}
