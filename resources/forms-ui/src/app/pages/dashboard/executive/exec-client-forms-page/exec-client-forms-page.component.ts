import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FormsService } from 'src/app/services/forms/forms.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-client-forms-page',
  templateUrl: './exec-client-forms-page.component.html',
  styleUrls: ['./exec-client-forms-page.component.css']
})
export class ExecClientFormsPageComponent implements OnInit {
  user: Users;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  can_print: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  allFormsList: Array<any>;

  constructor(
    private router: Router,
    private formsService: FormsService,
    private localStorage: LocalStorageService,
  ) {
    this.allFormsList = [];
    this.user = this.localStorage.getUser();
    this.getAllMerchantForms();
  }

  ngOnInit() {
  }

  open(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/executive/clients_form_data', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isEmpty(this.formsService.nextPaginationUrl) ? false : true;
  }

  getAllMerchantForms() {
    this.loading = true;
    this.formsService.getAllFormsByMerchant(this.user.merchant_id.toString()).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            this.allFormsList.push(form);
          });
          this.loading = false;
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

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.formsService.nextPaginationUrl;
    this.formsService.getAllFormsByMerchant(this.user.merchant_id.toString(), moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          this.allFormsList.push(form);
        });
        this.loading = false;
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getAllMerchantForms();
  }

}
