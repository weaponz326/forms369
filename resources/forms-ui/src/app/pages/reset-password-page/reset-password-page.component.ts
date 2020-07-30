import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
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

  showResetFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Sorry!, We couldnt reset your password. Please make sure you have an active internet connection or our serevsr may be down.',
      confirmButtonText: 'Arrrgh!, Ok',
    });
  }

  showResetSuccessfulAlert() {
    Swal.fire({
      title: 'Success',
      icon: 'success',
      text: 'Password reset was successful.',
      confirmButtonText: 'Ok',
      onDestroy: () => {
        this.router.navigateByUrl('/login');
      }
    });
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

  getClientId() {
    const index = window.location.href.lastIndexOf('=') + 1;
    const id = window.location.href.substr(index);
    return id;
  }

  create() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
    }
    else {
      if (this.passwordsMatch()) {
        console.log('matches');
        this.form.disable();
        this.loading = true;
        const client_id = this.getClientId();
        this.accountService.changeAccountPassword(client_id, this.f.password.value).then(
          res => {
            const response = res as any;
            this.form.enable();
            this.loading = false;
            if (_.toLower(response.message) == 'ok') {
              sessionStorage.clear();
              this.showResetSuccessfulAlert();
            }
            else {
              this.showResetFailedAlert();
            }
          },
          err => {
            this.form.enable();
            this.loading = false;
          }
        );
      }
      else {
        this.form.enable();
        this.loading = false;
        console.log('doesnt match');
        this.f.password2.setErrors({ unmatched: true });
      }
    }
  }

}
