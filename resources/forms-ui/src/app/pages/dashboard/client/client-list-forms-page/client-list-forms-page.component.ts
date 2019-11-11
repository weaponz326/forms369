import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';

@Component({
  selector: 'app-client-list-forms-page',
  templateUrl: './client-list-forms-page.component.html',
  styleUrls: ['./client-list-forms-page.component.css']
})
export class ClientListFormsPageComponent implements OnInit {
  query: string;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  isConnected: boolean;
  formsList: Array<any>;

  constructor(
    private router: Router,
    private formBuilderService: FormBuilderService
  ) {
    this.formsList = [];
    this.isConnected = window.navigator.onLine ? true : false;
    this.getAllForms();
  }

  ngOnInit() {
  }

  open(form: any) {
    sessionStorage.setItem('selected_form', JSON.stringify(form));
    this.router.navigateByUrl('/client/form_merchant');
  }

  search(event: any) {
    // if (_.isUndefined(this.query) || _.isEmpty(this.query)) {

    // }
    // else {
    //   this.
    // }
  }

  getAllForms() {
    this.loading = true;
    this.formBuilderService.getAllForms().then(
      res => {
        const forms = res as any;
        if (forms.length > 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(forms, (form) => {
            this.formsList.push(form);
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

  loadMore() {}

}
