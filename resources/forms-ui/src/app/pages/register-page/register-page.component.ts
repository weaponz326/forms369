import { Component, OnInit } from '@angular/core';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  providers: [AccountService]
})
export class RegisterPageComponent implements OnInit {

  form: FormGroup;
  created: boolean;
  loading: boolean;
  submitted: boolean;
  emailInUse: boolean;
  countriesList: Array<ICountry>;

  constructor(
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
      password: ['', [Validators.minLength(6), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]]
    });
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  getFormData() {
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const email = this.f.emailAddress.value;
    const country = this.f.country.value;
    const username = this.f.username.value;
    const password = this.f.password.value;

    const user = new Users(fname, lname, email, password, username, country, password, UserTypes.Client);
    return user;
  }

  register() {
    console.log('yeh');
    this.loading = true;
    this.submitted = true;
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
          if (response.message.toLowerCase() == 'ok') {
            this.form.enable();
            this.loading = false;
            this.created = true;
          }
          else {
            this.form.enable();
            this.loading = false;
            alert('an error occured');
          }
        },
        err => {
          this.form.enable();
          this.loading = false;
          console.log(err);
        }
      );
    }
  }

}