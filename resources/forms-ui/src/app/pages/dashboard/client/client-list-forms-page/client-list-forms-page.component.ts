import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormBuilderService } from 'src/app/services/form-builder/form-builder.service';
import { FormsService } from 'src/app/services/forms/forms.service';

@Component({
  selector: 'app-client-list-forms-page',
  templateUrl: './client-list-forms-page.component.html',
  styleUrls: ['./client-list-forms-page.component.css']
})
export class ClientListFormsPageComponent implements OnInit {
  query: string;
  company: any;
  hasData: boolean;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  isConnected: boolean;
  formsList: Array<any>;

  constructor(
    private router: Router,
    private formService: FormsService,
    private formBuilderService: FormBuilderService
  ) {
    this.formsList = [];
    this.company = history.state.company;
    this.isConnected = window.navigator.onLine ? true : false;
    this.getAllForms();
  }

  ngOnInit() {
  }

  open(form: any) {
    this.router.navigateByUrl('/client/form_entry/' + form.form_code, { state: { form: form }});
  }

  search(event: any) {
    if (_.isUndefined(this.query) || _.isEmpty(this.query)) {
    }
    else {
    }
  }

  getAllForms() {
    this.loading = true;
    const merchant_id = this.company.id;
    this.formService.getAllFormsByMerchant(merchant_id).then(
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
