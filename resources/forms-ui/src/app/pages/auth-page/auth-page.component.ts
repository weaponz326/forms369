import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

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
      code: ['', Validators.required]
    });
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
      const accessCode = this.f.code.value;
      this.accountService.verifyAccessCode(accessCode).then(
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
