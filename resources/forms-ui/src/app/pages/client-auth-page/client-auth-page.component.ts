import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-client-auth-page',
  templateUrl: './client-auth-page.component.html',
  styleUrls: ['./client-auth-page.component.css']
})
export class ClientAuthPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  countDown: string;
  submitted: boolean;
  codeExpired: boolean;
  invalidCode: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private localStorage: LocalStorageService,
  ) {
    this.setupCountDown();
  }

  ngOnInit() {
     this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: ['', Validators.required]
    });
  }

  setupCountDown() {
    for (let i = 30; i > 30; i--) {
      this.countDown = i.toString();
    }
  }

  handleLoginErrorResponses(response: any) {
    switch (response.message) {
      case 'CODE_EXPIRED':
        this.codeExpired = true;
        break;
      case 'INVALID_CODE':
        this.invalidCode = true;
        break;
      default:
        break;
    }
  }

  handleDashboardNavigation() {
    // check whether user used a shared link.
    console.log('is running handleDashboardNavigation');
    const shared_form_code = sessionStorage.getItem('shared_link');
    if (_.isUndefined(shared_form_code) || _.isNull(shared_form_code)) {
      this.loading = false;
      window.location.assign('/client');
    }
    else {
      // this.router.navigateByUrl('/client/form_link_redirect');
      window.location.assign('/client/form_link_redirect');
    }
  }

  submit() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
    }
    else {
      this.form.disable();
      const authCode = this.f.code.value;
      const id = sessionStorage.getItem('client_id');
      const phone = sessionStorage.getItem('client_phone');
      this.clientService.verifyAuthCode(id, authCode, phone).then(
        res => {
          this.form.enable();
          const response = res as any;
          if (_.isUndefined(response.message)) {
            // save user data locally.
            const user = response.user as Users;
            this.localStorage.token = response.token;
            this.localStorage.tokenExpiration = response.expires_at;
            this.localStorage.saveUserInformation(user);

            // clear client data used to help with authentication.
            sessionStorage.removeItem('client_id');
            sessionStorage.removeItem('client_phone');

            this.handleDashboardNavigation();
            // this.router.navigateByUrl('/client');
          }
          else {
            this.handleLoginErrorResponses(response);
          }
        },
        err => {
          this.form.enable();
          this.loading = false;
          this.handleLoginErrorResponses(err.error);
        }
      );
    }
  }

}
