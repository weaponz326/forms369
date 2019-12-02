import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyBranches } from 'src/app/models/company-branches.model';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';

@Component({
  selector: 'app-create-branch-page',
  templateUrl: './create-branch-page.component.html',
  styleUrls: ['./create-branch-page.component.css'],
  providers: [BranchService, CompanyService, ExecutiveService]
})
export class CreateBranchPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  _loading: boolean;
  created: boolean;
  submitted: boolean;
  companiesList: Array<any>;
  branchAdminsList: Array<any>;
  branchExecutivesList: Array<any>;
  companyNamesList: Array<string>;
  branchAdminEmailList: Array<string>;
  branchExecutiveEmailList: Array<string>;
  filteredMerchants: Observable<string[]>;
  filteredBranchAdmins: Observable<string[]>;
  filteredBranchExecutives: Observable<string[]>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private companyService: CompanyService,
    private executiveService: ExecutiveService
  ) {
    this.companiesList = [];
    this.companyNamesList = [];
    this.branchAdminsList = [];
    this.branchExecutivesList = [];
    this.branchAdminEmailList = [];
    this.branchExecutiveEmailList = [];

    this.initializeView();
  }

  ngOnInit() {
    this.buildForm();
  }

  public get f() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      merchant: ['', Validators.required],
      branchName: ['', Validators.required],
      branchAdmin: ['', Validators.required],
      branchSupervisor: ['', Validators.required]
    });
  }

  getFormData() {
    let merchant_id = 0;
    let branch_super_id = 0;
    let brandh_admin_id = 0;
    _.forEach(this.companiesList, (company) => {
      if (company.merchant_name == this.f.merchant.value) {
        console.log('cccccccccc: ' + company.id);
        merchant_id = company.id;
      }
    });
    _.forEach(this.branchExecutivesList, (executive) => {
      if (executive.email == this.f.branchSupervisor.value) {
        branch_super_id = executive.id;
      }
    });
    _.forEach(this.branchAdminsList, (admin) => {
      if (admin.email == this.f.branchAdmin.value) {
        console.log('dddddd: ' + admin.id);
        brandh_admin_id = admin.id;
      }
    });
    const branch = new CompanyBranches(
      merchant_id,
      this.f.branchName.value,
      branch_super_id,
      brandh_admin_id
    );
    return branch;
  }

  initializeView() {
    this._loading = true;
    this.getCompany();
    this.getBranchAdmins();
    this.getBranchExecutive();
  }

  filter(collection: Array<any>, value: string) {
    console.log('filtering');
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.email.toLowerCase().includes(filterValue));
  }

  singleValueFilter(collection: Array<string>, value: string) {
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.toLowerCase().includes(filterValue));
  }

  getCompany() {
    this.companyService.getAllCompanyCollection().then(
      res => {
        const merchants = res as any;
        console.log(JSON.stringify(merchants));
        if (merchants.length != 0) {
          _.forEach(merchants, (company) => {
            this.companiesList.push(company);
            this.companyNamesList.push(company.merchant_name);
          });
          this.filteredMerchants = this.f.merchant.valueChanges.pipe(
            startWith('-'),
            map(value => this.singleValueFilter(this.companyNamesList, value))
          );
        }
        else {
          this._loading = false;
        }
      },
      err => {
        this._loading = false;
        console.log('companies_error: ' + JSON.stringify(err));
      }
    );
  }

  getBranchExecutive() {
    this.executiveService.getBranchSuperExecutives().then(
      res => {
        const executives = res as any;
        if (executives.length != 0) {
          _.forEach(executives, (executive) => {
            this.branchExecutivesList.push(executive);
            this.branchExecutiveEmailList.push(executive.email);
          });
          this.filteredBranchExecutives = this.f.branchSupervisor.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.branchExecutivesList, value))
          );
        }
        else {
          this._loading = false;
        }
      },
      err => {
        this._loading = false;
      }
    );
  }

  getBranchAdmins() {
    this.branchService.getAllBranchAdmins().then(
      res => {
        const admins = res as any;
        console.log('res_length: ' + admins.length);
        if (admins.length != 0) {
          _.forEach(admins, (admin) => {
            this.branchAdminsList.push(admin);
            this.branchAdminEmailList.push(admin.email);
            console.log('braem: ' + this.branchAdminEmailList);
          });
          this._loading = false;
          this.filteredBranchAdmins = this.f.branchAdmin.valueChanges.pipe(
            startWith('-'),
            map(value => this.filter(this.branchAdminsList, value))
          );
        }
        else {
          this._loading = false;
        }
      },
      err => {
        this._loading = false;
      }
    );
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
      const branch = this.getFormData();
      this.branchService.createBranch(branch).then(
        res => {
          this.form.enable();
          this.loading = false;
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            this.created = true;
          }
          else {
            this.created = false;
          }
        },
        err => {
          this.form.enable();
          this.created = false;
          this.loading = false;
        }
      );
    }
  }

  ok() {
    this.router.navigateByUrl('/git_admin/lists/branch');
  }

  cancel() {
    this.f.merchant.setValue('');
    this.f.branchName.setValue('');
    this.f.branchAdmin.setValue('');
    this.f.branchSupervisor.setValue('');
  }

  bringBackForm() {
    this.form.reset();
    this.submitted = false;
    this.created = !this.created;
  }

}
