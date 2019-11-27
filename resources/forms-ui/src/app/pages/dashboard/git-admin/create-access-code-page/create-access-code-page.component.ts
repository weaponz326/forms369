import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { AccountService } from 'src/app/services/account/account.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-create-access-code-page',
  templateUrl: './create-access-code-page.component.html',
  styleUrls: ['./create-access-code-page.component.css']
})
export class CreateAccessCodePageComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  created: boolean;
  firstname: string;
  accessCode: string;
  submitted: boolean;
  branchesList: Array<any>;
  merchantsList: Array<any>;
  branchNamesList: Array<any>;
  merchantNamesList: Array<any>;
  filteredBranches: Observable<string[]>;
  filteredMerchants: Observable<string[]>;
  @ViewChild('confirm', { static: false }) modalTemplateRef: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private companyService: CompanyService,
    private accountService: AccountService,
    private localStorage: LocalStorageService
  ) {
    this.branchesList = [];
    this.merchantsList = [];
    this.branchNamesList = [];
    this.merchantNamesList = [];
    this.firstname = this.localStorage.getUser().firstname;

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
      branch: ['', Validators.required],
      merchant: ['', Validators.required],
      deviceName: ['', Validators.required],
      sourceName: ['', Validators.required]
    });
  }

  initializeView() {
    this.getCompany();
  }

  filter(collection: Array<string>, value: string) {
    const filterValue = value.toLowerCase();
    return collection.filter(item => item.toLowerCase().includes(filterValue));
  }

  companySelected(value: any) {
    this.getCompanyBranches();
  }

  getFormData() {
    const source_name = this.f.sourceName.value;
    const device_name = this.f.deviceName.value;
    const branch_id = this.getSelectedBranchIdentifier();
    const merchant_id = this.getSelectedMerchantIdentifier();

    return {
      branch_id: branch_id,
      merchant_id: merchant_id,
      device_name: device_name,
      source_usage: source_name
    };
  }

  getSelectedBranchIdentifier() {
    let branch_id = 0;
    _.forEach(this.branchesList, branch => {
      if (branch.branch_name == this.f.branch.value) {
        branch_id = branch.id;
      }
    });

    return branch_id;
  }

  getSelectedMerchantIdentifier() {
    let merchant_id = 0;
    _.forEach(this.merchantsList, company => {
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
          _.forEach(merchants, company => {
            this.merchantsList.push(company);
            this.merchantNamesList.push(company.merchant_name);
          });
          this.filteredMerchants = this.f.merchant.valueChanges.pipe(
            startWith('*'),
            map(value => this.filter(this.merchantNamesList, value))
          );
        } else {
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
          _.forEach(branches, branch => {
            this.branchesList.push(branch);
            this.branchNamesList.push(branch.branch_name);
            console.log('branches: ' + this.branchNamesList);
          });
          this.filteredBranches = this.f.branch.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(this.branchNamesList, value))
          );
        } else {
        }
      },
      err => {}
    );
  }

  create() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.form.enable();
      this.loading = false;
      return;
    } else {
      this.form.disable();
      const access_code = this.getFormData();
      console.log('body: ' + JSON.stringify(access_code));
      this.accountService.createAccessCode(access_code).then(
        code => {
          console.log(code);
          if (!_.isEmpty(code) || !_.isNull(code)) {
            this.form.enable();
            this.created = true;
            this.loading = false;
            this.accessCode = code;
          } else {
            this.form.enable();
            this.created = false;
            this.loading = false;
          }
        },
        err => {
          this.form.enable();
          this.created = false;
          this.loading = false;
          console.log(JSON.stringify(err));
        }
      );
    }
  }

  isFormEmpty() {
    if (
      _.isEmpty(this.f.branch.value) && _.isEmpty(this.f.merchant.value)
      && _.isEmpty(this.f.deviceName.value) && _.isEmpty(this.f.sourceName.value)
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  cancel() {
    if (!this.isFormEmpty()) {
      this.modalService.open(this.modalTemplateRef, { centered: true }).result.then(result => {
        if (result == 'yes') {
          this.clearData();
        }
      });
    }
  }

  clearData() {
    this.f.branch.setValue('');
    this.f.merchant.setValue('');
    this.f.deviceName.setValue('');
    this.f.sourceName.setValue('');
  }
}
