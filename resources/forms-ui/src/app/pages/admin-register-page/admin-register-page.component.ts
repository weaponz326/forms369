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
  submitted: boolean;
  dynamicError: boolean;
  countriesList: Array<ICountry>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private countryPickerService: CountryPickerService
  ) {
    this.countriesList = [];
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
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
      phone: ['', [Validators.maxLength(20), Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  getFormData() {
    const phone = this.f.phone.value;
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const email = this.f.emailAddress.value;
    const country = this.f.country.value;
    const dCode = this.f.dialCode.value;
    const username = this.f.username.value;
    const password = this.f.password.value;

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
  }

}
