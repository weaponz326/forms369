import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/services/forms/forms.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-forms-list-page',
  templateUrl: './exec-forms-list-page.component.html',
  styleUrls: ['./exec-forms-list-page.component.css']
})
export class ExecFormsListPageComponent implements OnInit {
  loading: boolean;
  hasData: boolean;
  hasMore: boolean;
  hasError: boolean;
  merchantId: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  allFormsList: Array<any>;

  constructor(
    private router: Router,
    private formService: FormsService,
    private localStorage: LocalStorageService
  ) {
    this.allFormsList = [];
    this.getAllCompanyForms();
  }

  ngOnInit() {
  }

  checkIfHasMore() {
    return _.isNull(this.formService.nextPaginationUrl) ? false : true;
  }

  getAllCompanyForms() {
    this.loading = true;
    this.merchantId = this.localStorage.getUser().merchant_id.toString();
    console.log(this.merchantId);
    this.formService.getAllFormsByMerchant(this.merchantId).then(
      forms => {
        this.hasMore = this.checkIfHasMore();
        if (forms.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            this.allFormsList.push(form);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.formService.nextPaginationUrl;
    this.formService.getAllForms(moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const forms = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(forms, (form) => {
          this.allFormsList.push(form);
          this.allFormsList = _.reverse(this.allFormsList);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }
}
