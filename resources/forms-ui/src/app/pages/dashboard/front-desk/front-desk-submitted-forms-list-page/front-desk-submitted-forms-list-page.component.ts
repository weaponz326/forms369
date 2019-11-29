import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-front-desk-submitted-forms-list-page',
  templateUrl: './front-desk-submitted-forms-list-page.component.html',
  styleUrls: ['./front-desk-submitted-forms-list-page.component.css']
})
export class FrontDeskSubmittedFormsListPageComponent implements OnInit {
  user: Users;
  loading: boolean;
  hasData: boolean;
  hasError: boolean;
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

  open(form: any) {
    this.router.navigateByUrl('/front_desk/preview', { state: { form: form }});
  }

  getAllSubmittedForms() {
    this.loading = true;
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(0, merchant_id).then(
      res => {
        if (res.length != 0) {
          this.hasData = true;
          _.forEach(res, (form) => {
            this.submittedFormsList.push(form);
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

  retry() {
    this.getAllSubmittedForms();
  }

}
