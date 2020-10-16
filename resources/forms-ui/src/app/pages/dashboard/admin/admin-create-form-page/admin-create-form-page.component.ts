declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-admin-create-form-page',
  templateUrl: './admin-create-form-page.component.html',
  styleUrls: ['./admin-create-form-page.component.css']
})
export class AdminCreateFormPageComponent implements OnInit {
  template: any;
  pdfFile: File;
  tncFile: File;
  form: FormGroup;
  formName: string;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  formCode: string;
  _loading: boolean;
  hasError: boolean;
  submitted: boolean;
  toPublish: boolean;
  merchant_id: number;
  uploadError: boolean;
  canPublishForm: boolean;
  showFileUpload: boolean;
  showJoinQueue: boolean;
  showTncFileUpload: boolean;
  allMerchantsList: Array<any>;
  @ViewChild('tncFile', { static: false }) tncFileElement: ElementRef;
  @ViewChild('pdfFile', { static: false }) pdfFileElement: ElementRef;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private formService: FormsService,
    private companyService: CompanyService,
    private localStorage: LocalStorageService,
    private formBuilderService: FormBuilderService
  ) {
    this.allMerchantsList = [];
    this.canPublishForm = true;
    this.merchant_id = this.localStorage.getUser().merchant_id;
    this.template = window.history.state.template;
    this.handleUploadFileView(this.merchant_id.toString());
    this.getCompanies();
  }

  ngOnInit() {
    this.created = false;
    this._loading = true;
    this.buildForm();

    this.handleFormRender();
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

  handleUploadFileView(merchant_id: string) {
    console.log('handling can upload view');
    _.forEach(this.allMerchantsList, (merchant, i) => {
      if (merchant_id == merchant.id) {
        this.showFileUpload = merchant.can_print == 1 ? true : false;
        return;
      }
    });
  }

  handleFormRender() {
    this.formCode = this.formBuilderService.generateUniqueFormCode();
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
      this.formBuilderService.generateFormFieldsBySections().then(
        form_elements => {
          this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
            controlPosition: 'left',
            inputSets: form_elements,
            scrollToFieldOnAdd: false,
            defaultFields: this.template.form_fields,
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
  }

  buildForm() {
    this.form = this._formBuilder.group({
      pdf: [''],
      tnc: [''],
      canView: [''],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      hasTnc: ['', Validators.required],
      canJoin: ['', Validators.required],
      merchant: ['', Validators.required],
      currency: ['', Validators.required],
      signature: ['', Validators.required],
      hasPayment: ['', Validators.required],
    });
  }

  public get f() {
    return this.form.controls;
  }

  public get _merchant() {
    return this.form.get('merchant');
  }

  getForm() {
    return this.formBuilder.actions.getData();
  }

  checkIfQMSEnabled(merchant_id: string) {
    this.companyService.isQMSEnabled(merchant_id).then(
      res => {
        this.showJoinQueue = res ? true : false;
      }
    );
  }

  onMerchantSelect(e: any) {
    this._merchant.setValue(e.target.value, {
      onlySelf: true
    });
    this.handleUploadFileView(this.f.merchant.value);
    this.checkIfQMSEnabled(this.f.merchant.value);
  }

  tncSelected(e: any) {
    const selectedValue = this.f.hasTnc.value;
    if (selectedValue == '1') {
      this.showTncFileUpload = true;
      this.f.tnc.setValidators(Validators.required);
      this.f.tnc.updateValueAndValidity();
    }
    else {
      this.showTncFileUpload = false;
      this.f.tnc.clearValidators();
      this.f.tnc.updateValueAndValidity();
    }
  }


  inputFileChanged(ev: Event) {
    const pdf_file = this.pdfFileElement.nativeElement as HTMLInputElement;
    if (pdf_file.files[0] != undefined) {
      this.f.pdf.setValue(pdf_file.files[0].name);
      this.pdfFile = pdf_file.files[0];
      this.canPublishForm = false;
    }
  }

  inputFileChanged_1(ev: Event) {
    const tnc_file = this.tncFileElement.nativeElement as HTMLInputElement;
    this.f.tnc.setValue(tnc_file.files[0].name);
    this.tncFile = tnc_file.files[0];
  }

  showFilePicker() {
    const element = this.pdfFileElement.nativeElement as HTMLInputElement;
    element.click();
  }

  showFilePicker_1() {
    const element = this.tncFileElement.nativeElement as HTMLInputElement;
    element.click();
  }

  createForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const form = this.getForm();
    const formData = new Forms();

    if (form.length == 0) {
      this.loading = false;
      alert('Form fields cannot be empty');
    }
    else {
      formData.form_fields = form;
      formData.name = this.f.name.value;
      formData.form_code = this.formCode;
      formData.merchant_id = this.merchant_id;
      formData.status = this.toPublish ? 1 : 0;
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
      this.formService.uploadFormPDF(this.merchant_id.toString(), this.formCode, this.pdfFile).then(
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

  reset() {
    this.formBuilder.actions.clearFields();
  }


  save() {
    this.loading = true;
    this.pdfFile == null ? this.createForm() : this.createFormWithPDF();
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
    this.submitted = true;
    if (this.form.valid) {
      this.toPublish = true;
      this.save();
    }
  }

  bringBackForm() {
    this.reset();
    this.submitted = false;
    this.f.pdf.setValue('');
    this.f.name.setValue('');
    this.f.canView.setValue('');
    this.created = !this.created;
  }

  preview() {
    const form_data = { name: this.f.name.value, form_fields: this.getForm() };
    this.router.navigateByUrl('/admin/details/form', { state: { form: form_data } });
  }

  ok() {
    this.router.navigateByUrl('/admin/lists/form');
  }

}
