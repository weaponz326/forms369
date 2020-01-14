import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-processed-forms-list-page',
  templateUrl: './front-desk-processed-forms-list-page.component.html',
  styleUrls: ['./front-desk-processed-forms-list-page.component.css']
})
export class FrontDeskProcessedFormsListPageComponent implements OnInit {
  user: Users;
  hasMore: boolean;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  can_print: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  processedFormsList: Array<any>;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processedFormsList = [];
    this.user = this.localStorage.getUser();
    this.can_print = this.user.can_print == 1 ? true : false;

    this.getAllProcessedForms();
  }

  ngOnInit() {
  }

  open(e: Event, form: any) {
    e.stopPropagation();
    this.router.navigateByUrl('/front_desk/preview', { state: { form: form }});
  }

  print(ev: Event, form: any) {
    ev.stopPropagation();
    this.can_print
      ? this.router.navigateByUrl('front_desk/print_form', { state: { form: form }})
      : this.router.navigateByUrl('front_desk/print_form_default', { state: { form: form }});
  }

  checkIfHasMore() {
    return _.isEmpty(this.frontDeskService.nextPaginationUrl) ? false : true;
  }

  getAllProcessedForms() {
    this.loading = true;
    const processedForms = [];
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(2, this.user.merchant_id.toString()).then(
      res => {
        this.hasMore = this.checkIfHasMore();
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            processedForms.push(form);
          });
          this.processedFormsList = _.reverse(_.sortBy(processedForms, (f) => f.created_at));
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
    const moreUrl = this.frontDeskService.nextPaginationUrl;
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(2, this.user.merchant_id.toString(), moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        this.hasMore = this.checkIfHasMore();
        _.forEach(res, (form) => {
          this.processedFormsList.push(form);
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
    this.getAllProcessedForms();
  }

}
