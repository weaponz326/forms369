import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-admin-register-page',
  templateUrl: './admin-register-page.component.html',
  styleUrls: ['./admin-register-page.component.css']
})
export class AdminRegisterPageComponent implements OnInit {

  error: string;
  form: FormGroup;
  created: boolean;
  loading: boolean;
  waiting: boolean;
  submitted: boolean;
  dynamicError: boolean;
  countriesList: Array<ICountry>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private countryPickerService: CountryPickerService
  ) {
    this.initVars();
    this.countriesList = [];
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
  }

  initVars() {
    console.log('hit access protection');
    this.waiting = true;
    if (window.location.origin != 'http://localhost:4200') {
      this.checkAccessToLogin();
    }
    else {
      this.waiting = false;
    }
  }

  public get f() {
    return this.form.controls;
  }

  public get country() {
    return this.form.get('country');
  }

  buildForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      dialCode: ['233', Validators.required],
      emailAddress: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      cPassword: ['', [Validators.minLength(6), Validators.required]],
      phone: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.required]],
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  passwordsMatch() {
    if (this.f.password.value != this.f.cPassword.value) {
      return false;
    }
    else {
      return true;
    }
  }

  getFormData() {
    const phone = this.f.phone.value;
    const lname = this.f.lastName.value;
    const dCode = this.f.dialCode.value;
    const country = this.f.country.value;
    const fname = this.f.firstName.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const email = this.f.emailAddress.value;

    const user = new Users(fname, lname, email, password, username, country, dCode + phone, password, UserTypes.GitAdmin);
    return user;
  }

  resolveLaravelError(e: any) {
    if (e.errors.username) {
      console.log('ok');
      this.error = e.errors.username;
      this.dynamicError = true;
    }
    else if (e.errors.email) {
      this.error = e.errors.email;
      this.dynamicError = true;
    }
    else if (e.errors.password) {
      this.error = e.errors.password;
      this.dynamicError = true;
    }
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.phone.value)) {
      const value = this.f.phone.value.substring(0, this.f.phone.value.length - 1);
      this.f.phone.setValue(value);
    }
  }

  checkAccessToLogin() {
    this.accountService.checkLoginAccess().then(
      res => {
        const response = res as any;
        if (response.message == 'No_access_code') {
          this.router.navigateByUrl('auth');
        }
        else if (response.message == 'Re_enter_access_code') {
          this.router.navigateByUrl('auth');
        }
        else {
          // the response message is: Access_granted
          // we do nothing, we allow them to see login
          // page and give them access to login.
          this.waiting = false;
        }
      },
      err => {}
    );
  }

  openDashboard() {
    this.router.navigateByUrl('git_admin');
  }

  register() {
    console.log('yeah');
    this.loading = true;
    this.submitted = true;
    this.dynamicError = false;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
      return;
    }
    else {
      if (this.passwordsMatch()) {
        this.form.disable();
        const user = this.getFormData();
        this.accountService.createAccount(user).then(
          res => {
            const response = res as any;
            if (!_.isUndefined(response.id)) {
              this.form.enable();
              this.loading = false;
              this.created = true;
            }
            else {
              this.form.enable();
              this.loading = false;
              console.log('an error occured');
            }
          },
          err => {
            this.form.enable();
            this.loading = false;
            console.log(JSON.stringify(err));
            this.resolveLaravelError(err.error);
          }
        );
      }
      else {
        this.form.enable();
        this.loading = false;
        console.log('doesnt match');
        this.f.cPassword.setErrors({ unmatched: true });
      }
    }
  }

}
