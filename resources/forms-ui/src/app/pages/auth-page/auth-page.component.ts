import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  invalid: boolean;
  submitted: boolean;

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
      code: ['', Validators.required]
    });
  }

  getFormData() {
    const data = {
      code: this.f.code.value
    };
    return data;
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
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
    }
    else {
      this.form.disable();
      const login = this.getFormData();
      this.accountService.verifyAccessCode(login.code).then(
        valid => {
          this.form.enable();
          this.loading = false;
          if (valid) {
            this.router.navigateByUrl('user_auth');
          }
        },
        err => {
          this.form.enable();
          this.loading = false;
          if (err.error.message == 'Access code already used') {
            this.invalid = true;
          }
        }
      );
    }
  }
}
