import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-client-list-form-data-page',
  templateUrl: './client-list-form-data-page.component.html',
  styleUrls: ['./client-list-form-data-page.component.css']
})
export class ClientListFormDataPageComponent implements OnInit {

  user: any;
  clientData: any;
  hasData: boolean;
  loading: boolean;
  created: boolean;
  allUserData: any;
  hasError: boolean;
  isConnected: boolean;

  constructor(
    private clientService: ClientService,
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
        if (res.length > 0) {
          this.hasData = true;
          this.loading = false;
          this.allUserData = res[0].client_details[0];
          console.log('details: ' + this.allUserData);
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        console.log('error: ' + JSON.stringify(err));
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  updateData() {
    this.loading = true;
    console.log('is submitting');
    const user_data = [this.allUserData];
    const filled_data = this.formBuilder.getFormUserData(user_data);
    const updated_data = this.clientService.getUpdatedClientFormData(JSON.parse(filled_data), this.allUserData);
    console.log('new updates: ' + updated_data);
    // this.clientService.submitForm(_.toString(this.user.id), this.form.form_code, this.allUserData, JSON.parse(updated_data)).then(
    //   res => {
    //     this.created = true;
    //     this.loading = false;
    //   },
    //   err => {
    //     this.loading = false;
    //   }
    // );
  }

  retry() {
    this.getAllClientData();
  }

  returnZero() {
    return 0;
  }
}
