import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

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
      password: ['', Validators.required]
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
      const newPassword = this.f.password.value;
      const user_id = sessionStorage.getItem('user_id');
      this.accountService.changeAccountPassword(user_id, newPassword).then(
        res => {
          const response = res as any;
          this.form.enable();
          this.loading = false;
          if (_.toLower(response.message) == 'ok') {
            sessionStorage.clear();
            this.router.navigateByUrl('login');
          }
          else {
            this.invalid = true;
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
