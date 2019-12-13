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
  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  can_print: boolean;
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

  open(form: any) {
    this.router.navigateByUrl('/front_desk/preview', { state: { form: form }});
  }

  print(ev: Event, form: any) {
    ev.stopPropagation();
    !this.can_print
      ? this.router.navigateByUrl('front_desk/print_form', { state: { form: form }})
      : this.router.navigateByUrl('front_desk/print_form_default', { state: { form: form }});
  }

  getAllProcessedForms() {
    this.loading = true;
    const processedForms = [];
    const merchant_id = this.user.merchant_id.toString();
    this.frontDeskService.getSubmittedFormByStatusAndMerchant(2, merchant_id).then(
      res => {
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

  retry() {
    this.getAllProcessedForms();
  }

}
