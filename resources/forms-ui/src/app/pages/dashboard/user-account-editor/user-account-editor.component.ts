import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { CountryPickerService, ICountry } from 'ngx-country-picker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
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
  isGitAdmin: boolean;
  loading: boolean;
  userDetails: any;
  submitted: boolean;
  emailInUse: boolean;
  isCompAdmin: boolean;
  isFrontDesk: boolean;
  oldPassword: string;
  newPassword: string;
  isSuperExec: boolean;
  branchesList: Array<any>;
  merchantsList: Array<any>;
  branchNamesList: Array<any>;
  merchantNamesList: Array<any>;
  countriesList: Array<ICountry>;
  filteredBranches: Observable<string[]>;
  filteredMerchants: Observable<string[]>;

  @Input() userId: string;
  @Output() userAccount = new EventEmitter();
  @Output() accountCreated = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private companyService: CompanyService,
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private countryPickerService: CountryPickerService
  ) {
    this.userDetails = null;
    this.oldPassword = '';
    this.newPassword = '';
    this.countriesList = [];
    this.branchesList = [];
    this.merchantsList = [];
    this.branchNamesList = [];
    this.merchantNamesList = [];
  }

  ngOnInit() {
    if (!_.isUndefined(this.userId)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_id', this.userId);
      this.userId = sessionStorage.getItem('u_id');
    }

    this.countryPickerService.getCountries().subscribe(countries => { this.countriesList = countries; });
    this.buildForm();
    this.getAccountDetails();
  }

  filter(collection: Array<string>, value: string) {
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.toLowerCase().includes(filterValue));
  }

  initializeView() {
    if (!this.isGitAdmin) {
      this.getCompany();
    }
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
      status: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      userType: ['', Validators.required],
      branch: ['', Validators.required],
      merchant: ['', Validators.required],
      dialCode: ['233', Validators.required],
      password: ['', [Validators.minLength(8), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.required]],
    });

    this.f.password.disable();
  }

  handleUserSelection() {
    if (this.isGitAdmin) {
      // remove validation of merchant and branch
      // so the account can be created.
      // this.f.userType.setValue('25');
      this.f.branch.clearValidators();
      this.f.merchant.clearValidators();
      this.f.branch.updateValueAndValidity();
      this.f.merchant.updateValueAndValidity();
      console.log('removed validators');
    }

    if (this.f.password.disabled) {
      this.f.password.clearValidators();
      this.f.password.updateValueAndValidity();
      console.log('removed password validators');
    }
  }

  companySelected(value: any) {
    this.branchesList = [];
    this.branchNamesList = [];
    this.filteredBranches = null;
    this.getCompanyBranches();
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

  onStatusChange(e: any) {}

  getAccountDetails() {
    console.log('the user id: ' + this.userId);
    const u_id = sessionStorage.getItem('u_id');
    this.accountService.getAccount(this.userId || u_id).then(
      res => {
        const account = res;
        this.userDetails = account;
        this.f.status.setValue(account.status);
        this.f.country.setValue(account.country);
        this.f.lastName.setValue(account.lastname);
        this.f.username.setValue(account.username);
        this.f.userType.setValue(account.user_type);
        this.f.emailAddress.setValue(account.email);
        this.f.firstName.setValue(account.firstname);
        this.f.phone.setValue(account.phone.substring(3));

        if (this.f.userType.value == UserTypes.GitAdmin) {
          // remove validation of merchant and branch
          // so the account can be created.
          this.isGitAdmin = true;
          this.f.branch.clearValidators();
          this.f.merchant.clearValidators();
          this.f.branch.updateValueAndValidity();
          this.f.merchant.updateValueAndValidity();
          console.log('removed validators');
        }
        else {
          if (this.f.userType.value == UserTypes.CompanyAdmin) {
            this.isCompAdmin = true;
            this.f.branch.clearValidators();
            this.f.branch.updateValueAndValidity();
          }
          else {
            if (this.f.userType.value == UserTypes.SuperExecutive) {
              this.isSuperExec = true;
              this.f.branch.clearValidators();
              this.f.branch.updateValueAndValidity();
            }
            else {
              this.isGitAdmin = false;
            }
          }

          this.initializeView();
        }
      },
      err => {}
    );
  }

  getCompany() {
    this.companyService.getAllCompanyCollection().then(
      res => {
        const merchants = res as any;
        if (merchants.length != 0) {
          _.forEach(merchants, (company) => {
            this.merchantsList.push(company);
            this.merchantNamesList.push(company.merchant_name);
            console.log('cccccccccc: ' + this.userDetails.merchant_name);
            if (company.merchant_name == this.userDetails.merchant_name) {
              this.f.merchant.setValue(company.merchant_name);
              this.getCompanyBranches();
              return;
            }
          });
          this.filteredMerchants = this.f.merchant.valueChanges.pipe(
            startWith('*'),
            map(value => this.filter(this.merchantNamesList, value))
          );
        }
        else {
        }
      },
      err => {
        console.log('companies_error: ' + JSON.stringify(err));
      }
    );
  }

  getCompanyBranches() {
    const id = this.getSelectedMerchantIdentifier();
    console.log('selected company_id: ' + id);
    this.branchService.getBranch(id.toString()).then(
      res => {
        const branches = res as any;
        console.log('res_length: ' + branches.length);
        if (branches.length != 0) {
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.branchNamesList.push(branch.branch_name);
            if (branch.branch_name == this.userDetails.branch_name) {
              this.f.branch.setValue(branch.branch_name);
            }
          });
          this.filteredBranches = this.f.branch.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(this.branchNamesList, value))
          );
        }
        else {
        }
      },
      err => {
      }
    );
  }

  getSelectedBranchIdentifier() {
    let branch_id = 0;
    _.forEach(this.branchesList, (branch) => {
      if (branch.branch_name == this.f.branch.value) {
        branch_id = branch.id;
      }
    });

    return branch_id;
  }

  getSelectedMerchantIdentifier() {
    let merchant_id = 0;
    _.forEach(this.merchantsList, (company) => {
      if (company.merchant_name == this.f.merchant.value) {
        merchant_id = company.id;
      }
    });

    return merchant_id;
  }

  getFormData() {
    const user: Users = new Users();
    const phone = this.f.phone.value;
    const status = this.f.status.value;
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const country = this.f.country.value;
    const dCode = this.f.dialCode.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const userType = this.f.userType.value;
    const email = this.f.emailAddress.value;
    const branch_id = this.getSelectedBranchIdentifier();
    const merchant_id = this.getSelectedMerchantIdentifier();

    if (this.isGitAdmin) {
      const merchantId = this.localStorage.getUser().merchant_id;
      if (this.f.password.disabled) {
        user.email = email;
        user.status = status;
        user.lastname = lname;
        user.firstname = fname;
        user.country = country;
        user.username = username;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.branch_id = branch_id;
        user.merchant_id = merchantId;
      }
      else {
        user.email = email;
        user.status = status;
        user.lastname = lname;
        user.firstname = fname;
        user.country = country;
        user.password = password;
        user.username = username;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.branch_id = branch_id;
        user.merchant_id = merchantId;
        console.log('must include password: ' + password);
      }

      return user;
    }
    else {
      if (this.f.password.value.length == 0) {
        user.email = email;
        user.status = status;
        user.lastname = lname;
        user.firstname = fname;
        user.country = country;
        user.username = username;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.branch_id = branch_id;
        user.merchant_id = merchant_id;
        console.log('must include _password: ' + password);
      }
      else {
        user.email = email;
        user.status = status;
        user.lastname = lname;
        user.firstname = fname;
        user.country = country;
        user.password = password;
        user.username = username;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.branch_id = branch_id;
        user.merchant_id = merchant_id;
        console.log('must include _password: ' + password);
      }

      return user;
    }
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

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.phone.value)) {
      const value = this.f.phone.value.substring(0, this.f.phone.value.length - 1);
      this.f.phone.setValue(value);
    }
  }

  editPassword() {
    this.f.password.enable();
    // this.f.password.setValue('');
    // this.f.password.updateValueAndValidity();
  }

  edit() {
    this.loading = true;
    this.submitted = true;
    this.handleUserSelection();
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

  cancel() {
    // quick hack to prevent displaying blank page when user navigates back
    // because of the history.state being set null by the browser.
    window.history.back();
    window.history.back();
  }
}
