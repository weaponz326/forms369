import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'src/app/services/client/client.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-exec-clients-forms-data-page',
  templateUrl: './exec-clients-forms-data-page.component.html',
  styleUrls: ['./exec-clients-forms-data-page.component.css']
})
export class ExecClientsFormsDataPageComponent implements OnInit {
  form: any;
  userData: any[];
  formName: string;
  keys: Array<any>;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  tableContents: Array<any>;
  clientFormData: Array<any>;
  tableHeaders: Array<string>;
  dtOptions: any;
  dtTrigger: Subject<any>;
  @ViewChild('data', { static: false }) dataModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) downloadModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.dtOptions = {
      paging: false,
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'csv',
        'print',
        'excel',
        'pdfHtml5'
      ]
    };
    // this.dtTrigger = new Subject();
    this.keys = [];
    this.userData = [];
    this.tableHeaders = [];
    this.tableContents = [];
    this.clientFormData = [];
    this.form = window.history.state.form;
    console.log('form: ' + JSON.stringify(this.form));
    this.resolveReloadDataLoss();
    this.formName = this.form.name;
    this.getClientData();
    // this._get();
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

  showDataModal() {
    this.modalService.open(this.dataModal, { centered: true });
  }

  showDownloadModal() {
    this.modalService.open(this.downloadModal, { centered: true });
  }

  showAttachmentsModal() {}

  getDataHeaders(res: any) {
    const form_fields = this.form.form_fields;
    const client_data_key = _.keys(res[0].client_submitted_details);

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
    _.forEach(res, data => {
      _.forEach(this.keys, (k) => {
        objArr.push(data.client_submitted_details[k]);
      });
      objArr.push(moment(data.submitted_at).format('DD MMM YYYY hh:mm A'));
      console.log(objArr);
      this.tableContents.push(objArr);
      objArr = [];
    });
  }

  getFullClientData(client_data: any) {
    console.log('client: ' + JSON.stringify(client_data));
    const form_field_keys = [];
    const form_keys = _.keys(client_data);
    const form_values = _.values(client_data);
    const form_fields = this.form.form_fields;
    _.forEach(form_fields, (field) => {
      if (!_.isUndefined(field.name)) {
        form_field_keys.push(field.name);
      }
    });

    _.forEach(form_keys, (key, i) => {
      _.forEach(form_field_keys, (field) => {
        if (field == key) {
          this.clientFormData.push({
            title: this.transformText(key),
            data: form_values[i]
          });
        }
      });
    });
  }

  _get() {
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
          this.userData = res[0].client_submitted_details;
          this.getFullClientData(this.userData);
          this.dtTrigger.next();
        }
      },
      err => {
        this.loading = false;
        console.log('err: ' + JSON.stringify(err));
      }
    );
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
          this.userData = res[0].client_submitted_details;
          this.getFullClientData(this.userData);
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
