import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Users } from 'src/app/models/users.model';

@Component({
  selector: 'app-client-forms-history-page',
  templateUrl: './client-forms-history-page.component.html',
  styleUrls: ['./client-forms-history-page.component.css']
})
export class ClientFormsHistoryPageComponent implements OnInit {

  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  historyCollection: Array<any>;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private localStorageService: LocalStorageService
  ) {
    this.historyCollection = [];
    this.user = this.localStorageService.getUser();
    this.getAllHistory();
  }

  ngOnInit() {
  }

  openFormEntry() {
    this.router.navigateByUrl('/client/form_entry/passport');
  }

  getAllHistory() {
    this.loading = true;
    this.clientService.getAllSubmittedForms(_.toString(this.user.id)).then(
      forms => {
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            this.historyCollection.push(form);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.hasError = true;
        this.loading = false;
      }
    );
  }

}
