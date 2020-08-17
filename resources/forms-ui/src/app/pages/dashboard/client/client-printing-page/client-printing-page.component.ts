import * as _ from 'lodash';
import { Printd } from 'printd';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-printing-page',
  templateUrl: './client-printing-page.component.html',
  styleUrls: ['./client-printing-page.component.css']
})
export class ClientPrintingPageComponent implements OnInit {

  form: any;
  client: any;
  logo: string;
  isPrint: boolean;
  loading: boolean;
  hasError: boolean;
  hasSignature: boolean;
  formKeys: Array<string>;
  formValues: Array<string>;
  signatureImageUrl: string;
  clientFormData: Array<any>;
  @ViewChild('content', { static: false }) content: ElementRef;

  constructor(
    private reloader: ReloadingService,
    private clientService: ClientService,
    private endpointService: EndpointService,
    private localService: LocalStorageService,
  ) {
    this.initVars();
    this.getSignature();
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
    this.form = this.reloader.resolveDataLoss(this.form);
    this.logo = this.endpointService.storageHost + this.form.logo;

    this.isPrint = this.form.print == true || _.isUndefined(this.form.print) ? true : false;
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

  getSignature() {
    const user_id = this.localService.getUser().id.toString();
    this.clientService.getProfileFormAttachment(user_id).then(
      res => {
        console.log('r__sss: ' + JSON.stringify(res));
        if (res.length > 0) {
          _.forEach(res, (doc) => {
            console.log('doc: ' + JSON.stringify(doc));
            if (doc.key == 'signature') {
              this.hasSignature = true;
              this.signatureImageUrl = this.endpointService.storageHost + 'attachments/' + doc.url;
            }
          });
        }
        else {
          this.hasSignature = false;
        }
      },
      err => {
        console.log('get_a_error: ' + JSON.stringify(err));
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

      .signature {
        display: block;
        margin: 0 auto;
        padding-top: 42px;
        padding-bottom: 30px;
      }

      .signature img {
        height: 120px;
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
