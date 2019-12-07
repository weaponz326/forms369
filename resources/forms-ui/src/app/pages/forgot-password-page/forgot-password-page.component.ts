import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css']
})
export class ForgotPasswordPageComponent implements OnInit {
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
      dialCode: ['233', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });
  }

  create() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
    }
    else {
      this.form.disable();
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
