import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-edit-form-page',
  templateUrl: './edit-form-page.component.html',
  styleUrls: ['./edit-form-page.component.css']
})
export class EditFormPageComponent implements OnInit {

  form: any;
  formBuilder: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  formName: string;
  formCode: string;
  merchant: string;
  formStatus: string;
  allMerchantsList: Array<any>;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private formBuilderService: FormBuilderService
  ) {
    this.merchant = '';
    this.allMerchantsList = [];
    this.form = window.history.state.form;
    this.getCompanies();
  }

  ngOnInit() {
    this.created = false;
    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      defaultFields: this.form.form_fields,
      disabledActionButtons: ['data', 'clear', 'save'],
    });
    this.formName = this.form.name;
    this.formStatus = this.form.status;
    this.formCode = this.form.form_code;
  }

  getCompanies() {
    this._loading = true;
    this.companyService.getAllCompanies().then(
      res => {
        console.log('all_comps: ' + JSON.stringify(res));
        const merchants = res as any;
        merchants.forEach(merchant => {
          this.allMerchantsList.push(merchant);
        });
        this.merchant = this.form.merchant_id;
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

  handleValidations() {}

  isFormValid() {
    if (_.isEmpty(this.formName) || _.isNull(this.merchant))
      return false;
    else
      return true;
  }

  editForm() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const form = this.getForm();
    const formData = new Forms();
    formData.form_fields = form;
    formData.name = this.formName;
    formData.form_code = this.form.form_code;
    formData.status = _.toInteger(this.formStatus);
    formData.merchant_id = parseInt(this.merchant);
    console.log(JSON.stringify(formData));

    this.formBuilderService.editForm(this.form.form_code, formData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
          this.form = formData;
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

  preview() {
    this.router.navigateByUrl('/git_admin/details/form', { state: { form: this.form }});
  }

  reset() {
    this.formBuilder.actions.clearFields();
  }

  edit() {
    this.isFormValid() ? this.editForm() : this.handleValidations();
  }

  bringBackForm() {
    this.router.navigateByUrl('git_admin/setup_form');
  }

  goHome() {
    this.router.navigateByUrl('/git_admin');
  }

}
