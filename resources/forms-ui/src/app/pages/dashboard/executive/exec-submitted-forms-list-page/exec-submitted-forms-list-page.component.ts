import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-submitted-forms-list-page',
  templateUrl: './exec-submitted-forms-list-page.component.html',
  styleUrls: ['./exec-submitted-forms-list-page.component.css']
})
export class ExecSubmittedFormsListPageComponent implements OnInit {
  user: Users;
  loading: boolean;
  hasData: boolean;
  hasMore: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  submittedFormsList: Array<any>;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService
  ) {
    this.submittedFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllSubmittedForms();
  }

  ngOnInit() {
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getAllSubmittedForms() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(0, merchant_id).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(res, (form) => {
            this.submittedFormsList.push(form);
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

  loadMore() {
    this.loadingMore = true;
    const merchant_id = this.user.merchant_id.toString();
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(0, merchant_id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          this.submittedFormsList.push(form);
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
    this.getAllSubmittedForms();
  }
}
