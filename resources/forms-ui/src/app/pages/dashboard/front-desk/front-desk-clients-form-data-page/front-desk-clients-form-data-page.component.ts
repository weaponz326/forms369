import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-clients-form-data-page',
  templateUrl: './front-desk-clients-form-data-page.component.html',
  styleUrls: ['./front-desk-clients-form-data-page.component.css']
})
export class FrontDeskClientsFormDataPageComponent implements OnInit {

  form: any;
  keys: Array<any>;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  tableContents: Array<any>;
  tableHeaders: Array<string>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.keys = [];
    this.tableHeaders = [];
    this.tableContents = [];
    this.form = window.history.state.form;
    console.log('form: ' + JSON.stringify(this.form));
    this.resolveReloadDataLoss();
    this.getClientData();
  }

  ngOnInit() {
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
      sessionStorage.setItem('u_form', JSON.stringify(this.form));
    }
    else {
      this.form = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getDataHeaders(res: any) {
    const form_fields = this.form.form_fields;
    const client_data_key = _.keys(res[0].client_submitted_details);
    console.log('form_fields: ' + form_fields);
    console.log('client_data_key: ' + client_data_key);

    _.forEach(form_fields, (field) => {
      _.forEach(client_data_key, (client_key) => {
        if (!_.isUndefined(field.name)) {
          if (field.name == client_key) {
            this.keys.push(client_key);
            const key = this.transformText(client_key);
            this.tableHeaders.push(key);
          }
        }
      });
    });
  }

  getDataBody(res: any) {
    let objArr = [];
    _.forEach(res, (data, i) => {
      _.forEach(this.keys, (k) => {
        objArr.push(data.client_submitted_details[k]);
      });
      objArr.push(moment(data.submitted_at).format('DD MMM YYYY hh:mm A'));
      console.log(objArr);
      this.tableContents.push(objArr);
      objArr = [];
    });
  }

  getClientData() {
    this.loading = true;
    this.frontDeskService.getRespondantData(this.form.form_code).then(
      res => {
        this.loading = false;
        this.hasMore = this.checkIfHasMore();
        console.log('res: ' + JSON.stringify(res));
        if (res.length == 0) {
          this.hasData = false;
        }
        else {
          this.hasData = true;
          this.getDataHeaders(res);
          this.getDataBody(res);
        }
      },
      err => {
        this.loading = false;
        console.log('err: ' + JSON.stringify(err));
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getRespondantData(this.form.form_code, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        this.getDataHeaders(res);
        this.getDataBody(res);
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
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

  retry() {
    this.getClientData();
  }

}
