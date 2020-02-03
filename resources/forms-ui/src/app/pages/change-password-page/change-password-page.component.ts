import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.css']
})
export class ChangePasswordPageComponent implements OnInit {
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
    this.showLoginSuccessAlert();
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]]
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

  showLoginSuccessAlert() {
    Swal.fire({
      title: 'Login Successful',
      text: 'Your first time login was successful, please setup an new password to protected your account.',
      icon: 'success',
      confirmButtonText: 'Okay',
      allowOutsideClick: false,
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
      if (this.passwordsMatch()) {
        console.log('matches');
        this.form.disable();
        const newPassword = this.f.password.value;
        const user_id = sessionStorage.getItem('user_id');
        this.accountService.changeAccountPassword(user_id, newPassword).then(
          res => {
            const response = res as any;
            this.form.enable();
            this.loading = false;
            if (_.toLower(response.message) == 'ok') {
              sessionStorage.clear();
              this.router.navigateByUrl('user_auth');
            }
            else {
              this.invalid = true;
            }
          },
          err => {
            this.form.enable();
            this.loading = false;
            this.invalid = true;
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
