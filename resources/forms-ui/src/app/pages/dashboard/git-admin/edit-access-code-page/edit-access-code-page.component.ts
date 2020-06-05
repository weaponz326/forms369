import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { ClipboardService } from 'ngx-clipboard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-edit-access-code-page',
  templateUrl: './edit-access-code-page.component.html',
  styleUrls: ['./edit-access-code-page.component.css']
})
export class EditAccessCodePageComponent implements OnInit {
  form: FormGroup;
  accessCode: any;
  loading: boolean;
  created: boolean;
  firstname: string;
  submitted: boolean;
  branchesList: Array<any>;
  merchantsList: Array<any>;
  branchNamesList: Array<any>;
  merchantNamesList: Array<any>;
  filteredBranches: Observable<string[]>;
  filteredMerchants: Observable<string[]>;
  @ViewChild('confirm', { static: false }) modalTemplateRef: TemplateRef<any>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private clipboard: ClipboardService,
    private branchService: BranchService,
    private companyService: CompanyService,
    private localStorage: LocalStorageService
  ) {
    this.branchesList = [];
    this.merchantsList = [];
    this.branchNamesList = [];
    this.merchantNamesList = [];
    this.accessCode = window.history.state.code;
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
      branch: [this.accessCode.branch_name, Validators.required],
      merchant: [this.accessCode.merchant_name, Validators.required],
      deviceName: [this.accessCode.devicename, Validators.required],
      sourceName: [this.accessCode.sourceusage, Validators.required]
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

  containsErrors(form_data: any) {
    if (form_data.merchant_id == 0) {
      this.f.merchant.setErrors({ null: true });
      return true;
    }

    if (form_data.branch_id == 0) {
      this.f.branch.setErrors({ null: true });
      return true;
    }

    return false;
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
    this.branchService.getCompanyBranches(id.toString()).then(
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
      // this.accountService.editAccess(access_code).then(
      //   code => {
      //     console.log(code);
      //     if (!_.isEmpty(code) || !_.isNull(code)) {
      //       this.form.enable();
      //       this.created = true;
      //       this.loading = false;
      //     } else {
      //       this.form.enable();
      //       this.created = false;
      //       this.loading = false;
      //     }
      //   },
      //   err => {
      //     this.form.enable();
      //     this.created = false;
      //     this.loading = false;
      //     console.log(JSON.stringify(err));
      //   }
      // );
    }
  }

  copy() {
    this.clipboard.copyFromContent(this.accessCode);
  }

  ok() {
    this.router.navigateByUrl('git_admin/lists/access_code');
  }

  cancel() {
    this.ok();
  }

  clearData() {
    this.f.branch.setValue('');
    this.f.merchant.setValue('');
    this.f.deviceName.setValue('');
    this.f.sourceName.setValue('');
  }

}
