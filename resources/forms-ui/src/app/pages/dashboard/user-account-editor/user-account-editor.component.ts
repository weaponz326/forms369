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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required],
      userType: ['', Validators.required],
      branch: ['', Validators.required],
      merchant: ['', Validators.required],
      dialCode: ['233', Validators.required],
      phone: ['', [Validators.maxLength(9), Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]]
    });

    this.f.password.disable();
  }

  handleUserSelection() {
    if (this.isGitAdmin) {
      // remove validation of merchant and branch
      // so the account can be created.
      this.f.userType.setValue('25');
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

  getAccountDetails() {
    this.accountService.getAccount(this.userId).then(
      res => {
        const account = res;
        this.userDetails = account;
        console.log('xxxxxxxxx: ' + this.userDetails.merchant_name);
        this.f.phone.setValue(account.phone);
        this.f.country.setValue(account.country);
        this.f.lastName.setValue(account.lastname);
        this.f.username.setValue(account.username);
        this.f.userType.setValue(account.user_type);
        this.f.emailAddress.setValue(account.email);
        this.f.firstName.setValue(account.firstname);

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
          }
          this.isGitAdmin = false;
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
    const lname = this.f.lastName.value;
    const fname = this.f.firstName.value;
    const email = this.f.emailAddress.value;
    const country = this.f.country.value;
    const dCode = this.f.dialCode.value;
    const username = this.f.username.value;
    const password = this.f.password.value;
    const userType = this.f.userType.value;
    const branch_id = this.getSelectedBranchIdentifier();
    const merchant_id = this.getSelectedMerchantIdentifier();

    if (this.isGitAdmin) {
      const merchantId = this.localStorage.getUser().merchant_id;
      if (this.f.password.disabled) {
        user.firstname = fname;
        user.lastname = lname;
        user.email = email;
        user.username = username,
        user.country = country;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.merchant_id = merchantId,
        user.branch_id = branch_id;
      }
      else {
        user.firstname = fname;
        user.lastname = lname;
        user.email = email;
        user.password = password,
        user.username = username,
        user.country = country;
        user.user_type = userType;
        user.phone = dCode + phone,
        user.merchant_id = merchantId,
        user.branch_id = branch_id;
      }

      return user;
    }
    else {
      if (this.f.password.disabled) {
        user.firstname = fname;
        user.lastname = lname;
        user.email = email;
        user.username = username,
        user.country = country;
        user.user_type = userType;
        user.phone = dCode + phone;
        user.merchant_id = merchant_id,
        user.branch_id = branch_id;
      }
      else {
        user.firstname = fname;
        user.lastname = lname;
        user.email = email;
        user.password = password,
        user.username = username,
        user.country = country;
        user.user_type = userType;
        user.phone = dCode + phone,
        user.merchant_id = merchant_id,
        user.branch_id = branch_id;
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

  editPassword() {
    this.f.password.enable();
    this.f.password.setValue('');
  }

  edit() {
    console.log('yeh');
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
    window.history.back();
  }
}
