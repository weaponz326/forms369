import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-user-account-editor',
  templateUrl: './user-account-editor.component.html',
  styleUrls: ['./user-account-editor.component.css']
})
export class UserAccountEditorComponent implements OnInit {

  id: string;
  form: FormGroup;
  isAdmin: boolean;
  loading: boolean;
  submitted: boolean;
  emailInUse: boolean;
  oldPassword: string;
  newPassword: string;
  @Input() userId: string;
  // isChangingPassword: boolean;
  countriesList: Array<ICountry>;
  @Output() userAccount = new EventEmitter();
  @Output() accountCreated = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private countryPickerService: CountryPickerService
  ) {
    this.oldPassword = '';
    this.newPassword = '';
    this.countriesList = [];
    this.isAdmin = this.localStorage.getUser().usertype == UserTypes.CompanyAdmin ? true : false;
  }

  ngOnInit() {
    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
    this.getAccountDetails();
  }

  public get f() {
    return this.form.controls;
  }

  public get country() {
    return this.form.get('country');
  }

  public get userType() {
    return this.form.get('userType');
  }

  buildForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      userType: ['', Validators.required],
      password: ['git_password', [Validators.minLength(6), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]]
    });
    this.f.password.disable();
  }

  onCountrySelect(e: any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    });
  }

  onUserSelect(e: any) {
    this.userType.setValue(e.target.value, {
      onlySelf: true
    });
  }

  getAccountDetails() {
    this.accountService.getAccount(this.userId).then(
      res => {
        const account = res;
        this.f.firstName.setValue(account.firstname);
        this.f.lastName.setValue(account.lastname);
        this.f.country.setValue(account.country);
        this.f.username.setValue(account.username);
        this.f.userType.setValue(account.user_type);
        this.f.emailAddress.setValue(account.email);
      },
      err => {}
    );
  }

  getFormData() {
    const user: Users = new Users();
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const email = this.f.emailAddress.value;
    const country = this.f.country.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const userType = this.f.userType.value;

    if (this.f.password.enabled) {
      user.firstname = fname;
      user.lastname = lname;
      user.email = email,
      user.password = password;
      user.username = username,
      user.country = country;
      user.user_type = userType;
      user.merchant_id = this.localStorage.getUser().merchant_id;
    }
    else {
      user.firstname = fname;
      user.lastname = lname;
      user.email = email,
      user.username = username,
      user.country = country;
      user.user_type = userType;
      user.merchant_id = this.localStorage.getUser().merchant_id;
    }

    return user;
  }

  resolveLaravelError(error: any) {
    console.log('err: ' + error);
    if (!_.isUndefined(error)) {
      const key = Object.keys(error);
      const value = Object.values(key);
      switch (key[0]) {
        case 'email':
          this.emailInUse = true;
          this.accountCreated.emit('email_in_use');
          break;
        default:
          break;
      }
    }
  }

  editPassword() {
    this.f.password.enable();
    this.f.password.setValue('');
  }

  edit() {
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
      this.accountService.editAccount(this.userId, user).then(
        res => {
          if (res) {
            this.form.enable();
            this.loading = false;
            this.accountCreated.emit('created');
            this.userAccount.emit(this.userType.value);
          }
          else {
            this.form.enable();
            this.loading = false;
            this.accountCreated.emit('not_created');
          }
        },
        err => {
          this.form.enable();
          this.loading = false;
          console.log(JSON.stringify(err));
          this.resolveLaravelError(err.error.errors);
        }
      );
    }
  }

}
