import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-list-form-data-page',
  templateUrl: './client-list-form-data-page.component.html',
  styleUrls: ['./client-list-form-data-page.component.css']
})
export class ClientListFormDataPageComponent implements OnInit {

  user: any;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  isConnected: boolean;

  constructor(
    private formBuilder: FormBuilderService,
    private localStorage: LocalStorageService
  ) {
    this.user = this.localStorage.getUser();
    console.log('user_id: ' + this.user.id);
    this.getAllClientData();
  }

  ngOnInit() {
  }

  getAllClientData() {
    this.loading = true;
    this.formBuilder.getUserFilledData(_.toString(this.user.id)).then(
      res => {
        console.log('user_data: ' + JSON.stringify(res));
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
      }
    );
  }

}
