import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  submitted: boolean;
  notClient: boolean;
  authFailed: boolean;
  deactivated: boolean;
  userNotFound: boolean;
  notConfirmed: boolean;
  invalidPassword: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  getFormData() {
    const data = {
      username: this.f.username.value,
      password: this.f.password.value
    };
    return data;
  }

  handleLoginErrorResponses(response: any) {
    switch (response.message) {
      case 'EMAIL_NOT_CONFIRMED':
        this.notConfirmed = true;
        break;
      case 'INVALID_PASSWORD':
        this.invalidPassword = true;
        break;
      case 'USER_NOT_FOUND':
        this.userNotFound = true;
        break;
      case 'ACCOUNT_DEACTIVATED':
        this.deactivated = true;
        break;
      default:
        this.notClient = true;
        break;
    }
  }

  didUserLoggedOut() {
    const authToken = this.localStorage.token;
    if (_.isNull(authToken) || _.isUndefined(authToken)) {
      // user logged out
      return true;
    }
    else {
      // user didn't log out
      return false;
    }
  }

  login() {
    if (this.didUserLoggedOut()) {
      this.loading = true;
      this.submitted = true;
      this.authFailed = false;
      this.deactivated = false;
      this.userNotFound = false;
      this.notConfirmed = false;
      this.invalidPassword = false;
      if (this.form.invalid) {
        this.form.enable();
        this.loading = false;
      }
      else {
        this.form.disable();
        const login = this.getFormData();
        this.accountService.authenticate(login.username, login.password).then(
          res => {
            const response = res as any;
            this.form.enable();
            this.loading = false;
            if (_.isUndefined(response.message)) {
              console.log('res: ' + response);
              sessionStorage.setItem('username', login.username);
              sessionStorage.setItem('password', login.password);

              sessionStorage.setItem('client_id', response.id);
              sessionStorage.setItem('client_phone', response.phone);
              this.router.navigateByUrl('client_auth');
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
    else {
      const shared_link_code = sessionStorage.getItem('shared_link');
      _.isNull(shared_link_code) || _.isUndefined(shared_link_code)
        ? this.router.navigateByUrl('client')
        : window.location.assign('/client/form_link_redirect');
    }
  }

}
