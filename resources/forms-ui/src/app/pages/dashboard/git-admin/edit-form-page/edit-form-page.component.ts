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
  selector: 'app-edit-form-page',
  templateUrl: './edit-form-page.component.html',
  styleUrls: ['./edit-form-page.component.css']
})
export class EditFormPageComponent implements OnInit {

  _form: any;
  pdfFile: File;
  form: FormGroup;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  formName: string;
  formCode: string;
  merchant: string;
  hasError: boolean;
  formStatus: string;
  submitted: boolean;
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
    this.merchant = '';
    this.allMerchantsList = [];
    this._form = window.history.state.form;
    this.getCompanies();
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formName = this._form.name;
    this.formStatus = this._form.status;
    this.formCode = this._form.form_code;

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
      pdf: [''],
      merchant: ['', Validators.required],
      name: [this._form.name, Validators.required],
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
        merchants.forEach(merchant => {
          this.allMerchantsList.push(merchant);
        });
        this.merchant = this._form.merchant_id;
        this.f.merchant.setValue(this._form.merchant_id);
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

  editForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const form = this.getForm();
    
    if (form.length == 0) {
      this.loading = false;
      alert('Form field cannot be empty');
    }
    else {
      const formData = new Forms();
      formData.form_fields = form;
      formData.name = this.f.name.value;
      formData.form_code = this._form.form_code;
      formData.status = _.toInteger(this.formStatus);
      formData.merchant_id = parseInt(this.f.merchant.value);

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
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this._form }});
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/form');
  }

}
