declare var $: any;
import * as _ from 'lodash';
import * as jsPDF from 'jspdf';
import { Printd } from 'printd';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company/company.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';

@Component({
  selector: 'app-executive-printing-page',
  templateUrl: './executive-printing-page.component.html',
  styleUrls: ['./executive-printing-page.component.css']
})
export class ExecutivePrintingPageComponent implements OnInit, AfterViewInit {
  form: any;
  client: any;
  logo: string;
  loading: boolean;
  isPrint: boolean;
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
    console.log(this.form.form_name);

    this.isPrint = this.form.print == true || _.isUndefined(this.form.print) ? true : false;

    this.client = this.form.client_data;
    console.log('client: ' + JSON.stringify(this.client));

    this.formKeys = _.keys(this.client);
    this.formValues = _.values(this.client);
    const formFields = this.form.form_data;
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

  getMerchant() {
    this.loading = true;
    const merchant_id = this.localService.getUser().merchant_id;
    this.companyService.getCompany(merchant_id).then(
      merchant => {
        this.loading = false;
        const merchant_logo = merchant[0].logo;
        console.log(merchant_logo);
        this.logo = this.endpointService.storageHost + merchant_logo;
      },
      error => {
        this.loading = false;
        this.hasError = true;
      }
    );
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

  download() {
    // setTimeout(() => {
    //   const elem_id = 'form-data';
    //   const filename = 'forms369_' + this.form.form_code + '_data';
    //   this.downloaderService.exportToPDF(elem_id, filename);
    //   window.history.back();
    // }, 1000);
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
      const toReplace = '/executive';
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
