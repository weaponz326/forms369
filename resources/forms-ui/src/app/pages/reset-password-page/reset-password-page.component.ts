import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css']
})
export class ResetPasswordPageComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  invalid: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  passwordsMatch() {
    if (this.f.password.value != this.f.password2.value) {
      return false;
    }
    else {
      return true;
    }
  }

  create() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
    }
    else {
      if (this.passwordsMatch()) {
        console.log('matches');
        this.form.disable();
        this.loading = true;
      }
      else {
        this.form.enable();
        this.loading = false;
        console.log('doesnt match');
        this.f.password2.setErrors({ unmatched: true });
      }
      // this.accountService.changeAccountPassword(user_id, newPassword).then(
      //   res => {
      //     const response = res as any;
      //     this.form.enable();
      //     this.loading = false;
      //     if (_.toLower(response.message) == 'ok') {
      //       sessionStorage.clear();
      //       this.router.navigateByUrl('user_auth');
      //     }
      //     else {
      //       this.invalid = true;
      //     }
      //   },
      //   err => {
      //     this.form.enable();
      //     this.loading = false;
      //   }
      // );
    }
  }

}
