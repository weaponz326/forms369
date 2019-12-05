import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  form: FormGroup;
  created: boolean;
  loading: boolean;
  submitted: boolean;
  emailInUse: boolean;
  countryDialCodes: Array<any>;
  countriesList: Array<ICountry>;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private countryPickerService: CountryPickerService
  ) {
    this.countriesList = [];
    this.countryDialCodes = [];
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.accountService.getCountryDialCodes().then(country_dial_codes => { this.countryDialCodes = country_dial_codes; });
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
      phone: ['', [Validators.maxLength(9), Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]],
      pwdConfirmation: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  doPasswordsMatch() {
    if (this.f.pwdConfirmation.value.length != this.f.password.value.length) {
      // unequal lengths
      return false;
    }
    else {
      if (this.f.pwdConfirmation.value != this.f.password.value) {
        // password do not match
        return false;
      }
      else {
        // there is a match!
        return true;
      }
    }
  }

  getFormData() {
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const phone = this.f.phone.value;
    const email = this.f.emailAddress.value;
    const country = this.f.country.value;
    const dCode = this.f.dialCode.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const pwdConfirm = this.f.pwdConfirmation.value;

    const user = new Users(fname, lname, email, password, username, country, dCode + phone, pwdConfirm, UserTypes.Client);
    return user;
  }

  register() {
    console.log('yeah');
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
      return;
    }
    else {
      if (this.doPasswordsMatch()) {
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
            console.log(err);
          }
        );
      }
      else {
        this.loading = false;
        this.f.pwdConfirmation.setErrors({ minlength: true });
      }
    }
  }

}
