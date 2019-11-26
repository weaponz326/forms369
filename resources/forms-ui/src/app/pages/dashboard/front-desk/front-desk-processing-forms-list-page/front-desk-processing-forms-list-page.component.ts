import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-processing-forms-list-page',
  templateUrl: './front-desk-processing-forms-list-page.component.html',
  styleUrls: ['./front-desk-processing-forms-list-page.component.css']
})
export class FrontDeskProcessingFormsListPageComponent implements OnInit {
  user: Users;
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  processedFormsList: Array<any>;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private frontDeskService: FrontDeskService,
  ) {
    this.processedFormsList = [];
    this.user = this.localStorage.getUser();

    this.getAllFormsInProcessing();
  }

  ngOnInit() {
  }

  showConfirmDialog() {}

  showCompletedDialog() {}

  showNotCompleteDialog() {}

  getAllFormsInProcessing() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(1, merchant_id).then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            this.processedFormsList.push(form);
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

  complete(submission_code: string) {
    this.loading = true;
    this.frontDeskService.completeForm(submission_code).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          this.loading = false;
          this.showCompletedDialog();
        }
        else {
          this.loading = false;
          this.showNotCompleteDialog();
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.showNotCompleteDialog();
      }
    );
  }

  process(submission_code: string) {
    this.loading = true;
    this.frontDeskService.processForm(submission_code).then(
      res => {
        const response = res as any;
        if (_.toLower(response.message) == 'ok') {
          this.loading = false;
          this.showCompletedDialog();
        }
        else {
          this.loading = false;
          this.showNotCompleteDialog();
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.showNotCompleteDialog();
      }
    );
  }

}
