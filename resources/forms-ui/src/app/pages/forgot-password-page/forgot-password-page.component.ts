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
  isValid: boolean;
  isInvalid: boolean;
  submitted: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
}

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
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
      this.accountService.verifyAccountForResetting(this.f.email.value).then(
        ok => {
          console.log('ok: ' + ok);
          if (ok) {
            this.loading = false;
            this.isValid = true;
          }
          else {
            this.loading = false;
            this.isInvalid = true;
          }
        },
        err => {
          this.form.enable();
          this.loading = false;
        }
      );
    }
  }

}
