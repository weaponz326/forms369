import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Forms } from 'src/app/models/forms.model';
import { CompanyService } from 'src/app/services/company/company.service';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';


@Component({
  selector: 'app-create-form-page',
  templateUrl: './create-form-page.component.html',
  styleUrls: ['./create-form-page.component.css']
})
export class CreateFormPageComponent implements OnInit {

  formBuilder: any;
  created: boolean;
  loading: boolean;
  _loading: boolean;
  formName: string;
  formCode: string;
  merchant: string;
  formStatus: string;
  selectedMerchant: number;
  allMerchantsList: Array<any>;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private formBuilderService: FormBuilderService
  ) {
    this.merchant = '';
    this.allMerchantsList = [];
    this.getCompanies();
  }

  ngOnInit() {
    this.created = false;
    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      disabledActionButtons: ['data', 'clear', 'save'],
    });
    this.formStatus = '0';
    this.formCode = this.formBuilderService.generateUniqueFormCode();
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

  save() {
    console.log(this.formBuilder.actions.getData());
    this.loading = true;
    const form = this.getForm();
    const formData = new Forms();
    formData.form_fields = form;
    formData.name = this.formName;
    formData.form_code = this.formCode;
    formData.status = _.toInteger(this.formStatus);
    formData.merchant_id = parseInt(this.merchant);
    console.log(JSON.stringify(formData));

    this.formBuilderService.createForm(formData).then(
      res => {
        this.loading = false;
        if (_.toLower(res.message) == 'ok') {
          this.created = true;
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

  preview() {}

  reset() {
    this.formBuilder.actions.clearFields();
  }

  create() {
    this.isFormValid() ? this.save() : this.handleValidations();
  }

  bringBackForm() {
    this.created = !this.created;
  }

  goHome() {
    this.router.navigateByUrl('/git_admin');
  }

}
