import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';

@Component({
  selector: 'app-form-printing-default-page',
  templateUrl: './form-printing-default-page.component.html',
  styleUrls: ['./form-printing-default-page.component.css']
})
export class FormPrintingDefaultPageComponent implements OnInit {

  form: any;
  client: any;
  logo: string;
  break: boolean;
  formKeys: Array<string>;
  formValues: Array<string>;
  clientFormData: Array<any>;

  constructor(
    private companyService: CompanyService,
    private endpointService: EndpointService,
    private localService: LocalStorageService
  ) {
    this.initVars();
    this.getMerchant();
  }

  ngOnInit() {
    window.onafterprint = () => {
      console.log('print window closed');
      this.showPrintButton();
    };

    window.onbeforeprint = () => {
      _.forEach(this.clientFormData, (data, i) => {
        if (i == 25) {
          this.break = true;
          console.log('breaking page ...');
        }
      });
      console.log('try splitting page here');
    };
  }

  initVars() {
    this.formKeys = [];
    this.formValues = [];
    this.clientFormData = [];

    this.form = window.history.state.form;
    this.client = this.form.client_submitted_details;

    this.formKeys = _.keys(this.client);
    this.formValues = _.values(this.client);

    _.forEach(this.formKeys, (key, i) => {
      this.clientFormData.push({
        title: this.transformText(key),
        data: this.formValues[i]
      });
    });
  }

  transformText(text: string) {
    if (_.includes(text, '-')) {
      return text.replace(/-/g, ' ');
    }
    else if (_.includes(text, '_')) {
      return _.replace(text, '_', ' ');
    }
    else {
      return text;
    }
  }

  getMerchant() {
    const merchant_id = this.localService.getUser().merchant_id;
    this.companyService.getCompany(merchant_id).then(
      merchant => {
        const merchant_logo = merchant[0].logo;
        this.logo = this.endpointService.storageHost + merchant_logo;
      }
    );
  }

  private hidePrintButton() {
    const printBtn = document.getElementById('print-button');
    printBtn.style.display = 'none';
  }

  private showPrintButton() {
    const printBtn = document.getElementById('print-button');
    printBtn.style.display = 'initial';
  }

  print() {
    this.hidePrintButton();
    window.print();
  }

}
