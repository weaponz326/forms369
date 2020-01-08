import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-clients-form-data-page',
  templateUrl: './front-desk-clients-form-data-page.component.html',
  styleUrls: ['./front-desk-clients-form-data-page.component.css']
})
export class FrontDeskClientsFormDataPageComponent implements OnInit {

  hasData: boolean;
  loading: boolean;
  form_code: string;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.form_code = window.history.state.form_code;
    console.log('form_code: ' + this.form_code);
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
    if (!_.isUndefined(this.form_code)) {
      sessionStorage.setItem('u_form', JSON.stringify(this.form_code));
    }
    else {
      this.form_code = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  getClientData() {
    this.loading = true;
    const merchant_id = this.localStorage.getUser().merchant_id;
    this.frontDeskService.getForm(this.form_code, _.toString(merchant_id)).then(
      res => {
        this.loading = false;
        console.log('res: ' + JSON.stringify(res));
      },
      err => {
        this.loading = false;
        console.log('error: ' + JSON.stringify(err));
      }
    );
  }

  retry() {
  }

}
