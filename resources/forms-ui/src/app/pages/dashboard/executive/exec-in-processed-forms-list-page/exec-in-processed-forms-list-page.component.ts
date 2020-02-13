import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-in-processed-forms-list-page',
  templateUrl: './exec-in-processed-forms-list-page.component.html',
  styleUrls: ['./exec-in-processed-forms-list-page.component.css']
})
export class ExecInProcessedFormsListPageComponent implements OnInit {
  user: Users;
  hasData: boolean;
  hasMore: boolean;
  loading: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  processingFormsList: Array<any>;

  constructor(
    private dateService: DateTimeService,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processingFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllFormsInProcessing();
  }

  ngOnInit() {
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getAllFormsInProcessing() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
            this.processingFormsList.push(form);
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
    const merchant_id = this.user.merchant_id.toString();
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          form.submitted_at = this.dateService.safeDateFormat(form.submitted_at);
          this.processingFormsList.push(form);
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
    this.getAllFormsInProcessing();
  }

}
