declare var $: any;
import * as _ from 'lodash';
import { ClientService } from 'src/app/services/client/client.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { ReloadingService } from 'src/app/services/reloader/reloading.service';
import { DownloaderService } from 'src/app/services/downloader/downloader.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-client-printing-page',
  templateUrl: './client-printing-page.component.html',
  styleUrls: ['./client-printing-page.component.css']
})
export class ClientPrintingPageComponent implements OnInit, AfterViewInit {
  form: any;
  client: any;
  logo: string;
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
    private localStorage: LocalStorageService,
    private downloadService: DownloaderService,
  ) {
    this.initVars();
    this.getSignature();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // !this.form.print ? this.download() : null;
  }

  initVars() {
    this.formKeys = [];
    this.formValues = [];
    this.clientFormData = [];
    const formFieldKeys = [];

    this.form = window.history.state.form;
    console.log('form: ' + JSON.stringify(this.form));
    this.form = this.reloader.resolveDataLoss(this.form);

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
    const user_id = this.localStorage.getUser().id.toString();
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

  download() {
    const filename = 'forms369_' + this.form.form_code + '_data';
    this.downloadService.exportToPDF(this.content, filename);
    window.history.back();
  }
}
