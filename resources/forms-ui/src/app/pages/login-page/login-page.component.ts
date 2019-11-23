import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: [AccountService, LocalStorageService]
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  created: boolean;
  submitted: boolean;
  deactivated: boolean;
  userNotFound: boolean;
  notConfirmed: boolean;
  invalidPassword: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private localStorageService: LocalStorageService
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
      case 'ACCOUNT_DEACTIVATED':
        this.deactivated = true;
        break;
      case 'INVALID_PASSWORD':
        this.invalidPassword = true;
        break;
      case 'USER_NOT_FOUND':
        this.userNotFound = true;
        break;
      default:
        break;
    }
  }

  navigateToUserDashboard(user_type: number) {
    if (user_type == UserTypes.Client) {
      this.router.navigateByUrl('/client');
    }
    else if (user_type == UserTypes.GitAdmin) {
      this.router.navigateByUrl('/git_admin');
    }
    else if (user_type == UserTypes.BranchAdmin) {
      this.router.navigateByUrl('/admin');
    }
    else if (user_type == UserTypes.BranchSuperExecutive) {
      this.router.navigateByUrl('/executive');
    }
    else if (user_type == UserTypes.CompanyAdmin) {
      this.router.navigateByUrl('/admin');
    }
    else if (user_type == UserTypes.FrontDesk) {
      this.router.navigateByUrl('/front_desk');
    }
    else if (user_type == UserTypes.SuperExecutive) {
      this.router.navigateByUrl('/executive');
    }
    else {
      alert('unknown user type');
    }
  }

  login() {
    this.loading = true;
    this.submitted = true;
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
            const user = response.user as Users;
            this.localStorageService.token = response.token;
            this.localStorageService.saveUserInformation(user);
            this.navigateToUserDashboard(user.usertype);
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
