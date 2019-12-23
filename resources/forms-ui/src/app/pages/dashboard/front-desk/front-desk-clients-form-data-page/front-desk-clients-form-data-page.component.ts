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

  loading: boolean;
  form_code: string;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.form_code = window.history.state.form_code;
  }

  ngOnInit() {
  }

  getClientData() {
    this.loading = true;
    const merchant_id = this.localStorage.getUser().merchant_id;
    this.frontDeskService.getForm(this.form_code, _.toString(merchant_id)).then(
      res => {},
      err => {}
    );
  }

}
