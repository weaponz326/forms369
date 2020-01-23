import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-user-account-creator',
  templateUrl: './user-account-creator.component.html',
  styleUrls: ['./user-account-creator.component.css'],
  providers: [BranchService, CompanyService, CountryPickerService]
})
export class UserAccountCreatorComponent implements OnInit {

  form: FormGroup;
  isAdmin: boolean;
  loading: boolean;
  submitted: boolean;
  isGitAdmin: boolean;
  isFrontDesk: boolean;
  isCompUser: boolean;
  isCompAdmin: boolean;
  isSuperExec: boolean;
  branchesList: Array<any>;
  merchantsList: Array<any>;
  branchNamesList: Array<any>;
  merchantNamesList: Array<any>;
  countriesList: Array<ICountry>;
  filteredBranches: Observable<string[]>;
  filteredMerchants: Observable<string[]>;
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
    this.countriesList = [];
    this.branchesList = [];
    this.merchantsList = [];
    this.branchNamesList = [];
    this.merchantNamesList = [];
    this.isAdmin = this.localStorage.getUser().usertype == UserTypes.GitAdmin ? true : false;
    this.isGitAdmin = this.localStorage.getUser().usertype == UserTypes.GitAdmin ? true : false;

    this.initializeView();
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
      branch: ['', Validators.required],
      merchant: ['', Validators.required],
      dialCode: ['233', Validators.required],
      password: ['', [Validators.minLength(8), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.required]],
    });
  }

  initializeView() {
    console.log('user_type: ' + this.localStorage.getUser().usertype);
    const user_type = this.localStorage.getUser().usertype;
    this.isCompUser =
      user_type == UserTypes.CompanyAdmin ||
      user_type == UserTypes.BranchAdmin ? true : false;
    if (this.isCompUser) {
      this.getCompany();
    }
    if (
      user_type == UserTypes.BranchAdmin ||
      user_type == UserTypes.CompanyAdmin ||
      user_type == UserTypes.BranchSuperExecutive
    ) {
      const merchant_id = this.localStorage.getUser().merchant_id;
      this.getCompanyBranches(merchant_id);
    }
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

    this.isAdmin = this.f.userType.value == UserTypes.GitAdmin ? true : false;
    this.isCompAdmin = this.f.userType.value == UserTypes.CompanyAdmin ? true : false;
    this.isSuperExec = this.f.userType.value == UserTypes.SuperExecutive  ? true : false;
    this.isFrontDesk =
      this.f.userType.value == UserTypes.FrontDesk ||
      this.f.userType.value == UserTypes.BranchSuperExecutive ||
      this.f.userType.value == UserTypes.BranchAdmin ? true : false;

    if (this.isCompAdmin || this.isSuperExec || this.f.userType.value == UserTypes.BranchSuperExecutive) {
      // remove validators of merchant and branch
      // so the account can be created.
      this.f.branch.clearValidators();
      this.f.merchant.clearValidators();
      this.f.branch.updateValueAndValidity();
      this.f.merchant.updateValueAndValidity();
    }

    if (this.f.userType.value == UserTypes.GitAdmin || this.f.userType.value == UserTypes.BranchAdmin) {
      // remove validation of merchant and branch
      // so the account can be created.
      this.f.branch.clearValidators();
      this.f.merchant.clearValidators();
      this.f.branch.updateValueAndValidity();
      this.f.merchant.updateValueAndValidity();
    }
    else {
      this.getCompany();
    }
  }

  handleUserSelection() {
    if (!this.isGitAdmin) {
      console.log('not git admin');
      // if logged in user is not a GIT Admin it means logged in user can only create
      // a front desk account. And since we are hiding the option to choose which kind
      // of user to be created, we have to set the user to Front Desk.
      this.f.userType.setValue('25');
      if (this.isCompUser) {
        console.log('is comp admin');
        this.f.merchant.clearValidators();
        this.f.merchant.updateValueAndValidity();
      }
    }
    else {
      console.log('no git admin');
    }
  }

  resolveStrCharacters(e: KeyboardEvent) {
    const regExp = new RegExp(/^\d*\.?\d*$/);
    if (!regExp.test(this.f.phone.value)) {
      const value = this.f.phone.value.substring(0, this.f.phone.value.length - 1);
      this.f.phone.setValue(value);
    }
  }

  companySelected(value: any) {
    this.getCompanyBranches();
  }

  filter(collection: Array<string>, value: string) {
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.toLowerCase().includes(filterValue));
  }

  getFormData() {
    const phone = this.f.phone.value;
    const dCode = this.f.dialCode.value;
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const country = this.f.country.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const userType = this.f.userType.value;
    const email = this.f.emailAddress.value;
    const branch_id = this.getSelectedBranchIdentifier();
    const merchant_id = this.getSelectedMerchantIdentifier();

    if (this.isAdmin || this.isCompUser) {
      const merchantId = this.localStorage.getUser().merchant_id;
      return new Users(fname, lname, email, password, username, country, dCode + phone, password, userType, userType, null, null, merchantId, branch_id);
    }
    else {
      return new Users(fname, lname, email, password, username, country, dCode + phone, password, userType, userType, null, null, merchant_id, branch_id);
    }
  }

  containErrors(data: Users) {
    if (this.f.userType.value == UserTypes.GitAdmin) {
      console.log('containErrors isGitAdmin');
      return false;
    }
    else {
      if (data.merchant_id == 0) {
        if (this.f.merchant.value == '') {
          if (data.branch_id == 0) {
            if (this.f.branch.value == '') {
              return false;
            }
            else {
              console.log('no branch');
              this.f.branch.setErrors({ null: true });
              return true;
            }
          }
        }
        else {
          if (data.branch_id == 0) {
            if (this.f.branch.value == '') {
              console.log('no merchant');
              this.f.merchant.setErrors({ null: true });
              return true;
            }
            else {
              console.log('no branch');
              this.f.branch.setErrors({ null: true });
              return true;
            }
          }
        }
      }
    }
  }

  resolveLaravelError(error: any) {
    const key = Object.keys(error);
    const value = Object.values(key);
    switch (key[0]) {
      case 'email':
        this.accountCreated.emit('email_in_use');
        break;
      case 'username':
        this.accountCreated.emit('username_in_use');
        break;
      default:
        break;
    }
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

  getCompany() {
    this.companyService.getAllCompanyCollection().then(
      res => {
        const merchants = res as any;
        console.log(JSON.stringify(merchants));
        if (merchants.length != 0) {
          _.forEach(merchants, (company) => {
            this.merchantsList.push(company);
            this.merchantNamesList.push(company.merchant_name);
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

  getCompanyBranches(merchant_id?: number) {
    this.branchesList = [];
    this.branchNamesList = [];
    const id = !_.isUndefined(merchant_id)
      ? merchant_id
      : this.getSelectedMerchantIdentifier();
    console.log('selected company_id: ' + id);
    this.branchService.getBranch(id.toString()).then(
      res => {
        const branches = res as any;
        console.log('res_length: ' + branches.length);
        if (branches.length != 0) {
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.branchNamesList.push(branch.branch_name);
            console.log('branches: ' + this.branchNamesList);
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

  register() {
    this.loading = true;
    this.submitted = true;
    this.handleUserSelection();
    if (this.form.invalid) {
      this.loading = false;
      console.log('errrrrrrr: ' + this.form.errors);
    }
    else {
      // this.loading = false;
      console.log('am here');
      const user = this.getFormData();
      if (!this.containErrors(user)) {
        this.form.disable();
        this.accountService.createAccount(user).then(
          res => {
            const response = res as any;
            if (response.id) {
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
      else {
        this.loading = false;
      }
    }
  }

  cancel() {
    window.history.back();
  }

}
