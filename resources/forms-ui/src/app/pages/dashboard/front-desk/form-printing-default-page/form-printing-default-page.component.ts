import * as _ from 'lodash';
import { Printd } from 'printd';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-form-printing-default-page',
  templateUrl: './form-printing-default-page.component.html',
  styleUrls: ['./form-printing-default-page.component.css']
})
export class FormPrintingDefaultPageComponent implements OnInit {

  form: any;
  client: any;
  logo: string;
  loading: boolean;
  hasError: boolean;
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

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this.form)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_form', JSON.stringify(this.form));
    }
    else {
      this.form = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  ngOnInit() {
  }

  initVars() {
    this.formKeys = [];
    this.formValues = [];
    this.clientFormData = [];
    const formFieldKeys = [];

    this.form = window.history.state.form;
    console.log('form: ' + JSON.stringify(this.form));
    this.resolveReloadDataLoss();

    this.client = this.form.client_submitted_details;
    console.log('client: ' + JSON.stringify(this.client));

    this.formKeys = _.keys(this.client);
    this.formValues = _.values(this.client);
    const formFields = this.form.form_fields;
    _.forEach(formFields, (field) => {
      if (!_.isUndefined(field.name)) {
        formFieldKeys.push(field.name);
      }
    });

    _.forEach(this.formKeys, (key, i) => {
      _.forEach(formFieldKeys, (field) => {
        if (field == key) {
          this.clientFormData.push({
            title: this.transformText(key),
            data: this.formValues[i]
          });
        }
      });
    });
  }

  transformText(text: string) {
    if (_.includes(text, '-')) {
      return text.replace(/-/g, ' ');
    }
    else if (_.includes(text, '_')) {
      return _.replace(text, /_/g, ' ');
    }
    else {
      return text;
    }
  }

  getMerchant() {
    this.loading = true;
    const merchant_id = this.localService.getUser().merchant_id;
    this.companyService.getCompany(merchant_id).then(
      merchant => {
        this.loading = false;
        const merchant_logo = merchant[0].logo;
        this.logo = this.endpointService.storageHost + merchant_logo;
      },
      error => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  printViewCss() {
    const css = [
      'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
      `h5 > strong {
        font-size: 13px;
        text-transform: uppercase;
      }

      .container .col-8 {
        padding-top: 10px;
      }

      .img-view, .title-view {
        text-align: center;
      }

      .img-view > img {
        width: 180px;
        height: 180px;
        margin-bottom: 25px;
      }

      .title-view h1 {
        margin-bottom: 40px;
      }
    `];

    return css;
  }

  printViewJs() {
    const scripts = [`
      const imgElement = document.querySelector('img');
      console.log(imgElement.src);
      const toReplace = '/front_desk';
      imgElement.src = imgElement.src.replace(/toReplace/g, '');
      console.log(imgElement.src);
    `];

    return scripts;
  }

  print() {
    const styles = this.printViewCss();
    const scripts = this.printViewJs();
    const el = document.getElementById('print-view');
    const d = new Printd();
    d.print(el, styles, scripts);
  }

}
