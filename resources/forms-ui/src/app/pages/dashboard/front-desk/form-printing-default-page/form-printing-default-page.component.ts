import * as _ from 'lodash';
import { Printd } from 'printd';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';

@Component({
  selector: 'app-form-printing-default-page',
  templateUrl: './form-printing-default-page.component.html',
  styleUrls: ['./form-printing-default-page.component.css']
})
export class FormPrintingDefaultPageComponent implements OnInit, AfterViewInit {

  form: any;
  client: any;
  logo: string;
  isPrint: boolean;
  loading: boolean;
  hasError: boolean;
  formKeys: Array<string>;
  formValues: Array<string>;
  clientFormData: Array<any>;

  constructor(
    private reloader: ReloadingService,
    private companyService: CompanyService,
    private endpointService: EndpointService,
    private localService: LocalStorageService,
    private downloaderService: DownloaderService,
  ) {
    this.initVars();
    this.getMerchant();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    !this.isPrint ? this.download() : null;
  }

  initVars() {
    this.formKeys = [];
    this.formValues = [];
    this.clientFormData = [];
    const formFieldKeys = [];

    this.form = window.history.state.form;
    console.log('form: ' + JSON.stringify(this.form));
    this.form = this.reloader.resolveDataLoss(this.form);

    this.isPrint = this.form.print == true ? true : false;
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

  download() {
    const elem_id = 'pdf-data';
    this.downloaderService.exportToPDF(elem_id, 'name');
    // navigate back
    window.history.back();
  }

}
