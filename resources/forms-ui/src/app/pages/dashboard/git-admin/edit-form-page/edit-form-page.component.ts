declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from 'src/app/services/forms/forms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
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
  alertTitle: string;
  formStatus: string;
  submitted: boolean;
  alertMessage: string;
  alertSuccess: boolean;
  isPublished: boolean;
  uploadError: boolean;
  showFileUpload: boolean;
  allMerchantsList: Array<any>;
  loadingModalRef: NgbModalRef;
  @ViewChild('pdfFile', {static: false}) pdfFileElement: ElementRef;
  @ViewChild('status', {static: false}) statusModal: TemplateRef<any>;
  @ViewChild('loader', {static: false}) loadingModal: TemplateRef<any>;
  @ViewChild('publish', {static: false}) publishModal: TemplateRef<any>;
  @ViewChild('unpublish', {static: false}) unPublishModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private formService: FormsService,
    private companyService: CompanyService,
    private formBuilderService: FormBuilderService
  ) {
    console.log('im constructor');
    this.merchant = '';
    this.allMerchantsList = [];
    this._form = window.history.state.form;
    this.resolveReloadDataLoss();
    this.isPublished = this._form.status == 1 ? true : false;
    this.getCompanies();
  }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this._form)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_form', JSON.stringify(this._form));
    }
    else {
      this._form = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  ngOnInit() {
    this.created = false;
    this.buildForm();

    this.formName = this._form.name;
    this.formStatus = this._form.status;
    this.formCode = this._form.form_code;

    this.formBuilderService.generateFormFieldsBySections().then(
      form_elements => {
        this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
          controlPosition: 'left',
          inputSets: form_elements,
          scrollToFieldOnAdd: true,
          defaultFields: this._form.form_fields,
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

  showLoadingModal() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingModal() {
    this.loadingModalRef.close();
  }

  buildForm() {
    this.form = this._formBuilder.group({
      pdf: [''],
      canView: [this._form.can_view],
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

  publishForm() {
    console.log('publish');
    this.modalService.open(this.publishModal, { centered: true }).result.then(
      result => {
        if (result == 'publish') {
          this.showLoadingModal();
          this.formService.changeFormStatus(this._form.form_code, 1).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.alertTitle = 'Success';
                this.alertMessage = 'Form has been successfully published';
                this.alertSuccess = true;
                this.isPublished = true;
                this.formStatus = '1';
                this.hideLoadingModal();
                this.modalService.open(this.statusModal, { centered: true });
              }
              else {
                this.alertTitle = 'Failed';
                this.alertMessage = 'Form failed to be published';
                this.alertSuccess = false;
                this.isPublished = false;
                this.hideLoadingModal();
                this.modalService.open(this.statusModal, { centered: true });
              }
            },
            err => {
              this.alertTitle = 'Failed';
              this.alertMessage = 'Form failed to be published';
              this.alertSuccess = false;
              this.isPublished = false;
              this.hideLoadingModal();
              this.modalService.open(this.statusModal, { centered: true });
            }
          );
        }
      }
    );
  }

  unpublishForm() {
    console.log('unpublish');
    this.modalService.open(this.unPublishModal, { centered: true }).result.then(
      result => {
        if (result == 'unpublish') {
          this.showLoadingModal();
          this.formService.changeFormStatus(this._form.form_code, 0).then(
            res => {
              const response = res as any;
              if (_.toLower(response.message) == 'ok') {
                this.alertTitle = 'Success';
                this.alertMessage = 'Form has been successfully unpublished';
                this.alertSuccess = true;
                this.isPublished = false;
                this.formStatus = '0';
                this.hideLoadingModal();
                this.modalService.open(this.statusModal, { centered: true });
              }
              else {
                this.alertTitle = 'Failed';
                this.alertMessage = 'Form failed to be unpublished';
                this.alertSuccess = false;
                this.isPublished = true;
                this.hideLoadingModal();
                this.modalService.open(this.statusModal, { centered: true });
              }
            },
            err => {
              this.alertTitle = 'Failed';
              this.alertMessage = 'Form failed to be unpublished';
              this.alertSuccess = false;
              this.isPublished = true;
              this.hideLoadingModal();
              this.modalService.open(this.statusModal, { centered: true });
            }
          );
        }
      }
    );
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

        this.handleUploadFileView(this.f.merchant.value);
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
      formData.can_view = this.f.canView.value == '' ? 0 : this.f.canView.value;

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

  editFormWithPDF() {
    if (this.getForm().length == 0) {
      alert('Form field cannot be empty');
    }
    else {
      this.formService.editFormPDF(this.merchant, this.formCode, this.pdfFile).then(
        res => {
          this.editForm();
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

  edit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      this.pdfFile == null ? this.editForm() : this.editFormWithPDF();
    }
  }

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this._form }});
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/form');
  }

}
