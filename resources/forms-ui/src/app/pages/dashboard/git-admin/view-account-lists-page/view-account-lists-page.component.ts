import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';


@Component({
  selector: 'app-view-account-lists-page',
  templateUrl: './view-account-lists-page.component.html',
  styleUrls: ['./view-account-lists-page.component.css'],
  providers: [AdminService, CompanyService, ExecutiveService]
})
export class ViewAccountListsPageComponent implements OnInit {

  user: string;
  loading: boolean;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  @Input() userType: any;
  @Input() merchantId: any;
  collection: Array<any>;
  allCollection: Array<any>;
  @Output() edit = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() dataLoaded = new EventEmitter();
  @Output() dataLoadedError = new EventEmitter();

  constructor(
    private router: Router,
    private adminService: AdminService,
    private branchService: BranchService,
    private companyService: CompanyService,
    private frontDeskService: FrontDeskService,
    private executiveService: ExecutiveService
  ) {
    this.collection = [];
    this.allCollection = [];
  }

  ngOnInit() {
    this.filterState = 'all';
    this.getAccountDetails();
  }

  _edit(id: string) {
    this.edit.emit(id);
  }

  _view(id: string) {
    this.view.emit(id);
  }

  _delete(id: string) {
    this.delete.emit(id);
  }

  showAll() {
    this.filterState = 'all';
    this.collection = this.allCollection;
  }

  showActive() {
    this.filterState = 'active';
    this.collection = _.filter(this.allCollection, (company) => company.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.collection = _.filter(this.allCollection, (company) => company.status == 0);
  }

  createAccount() {
    this.router.navigateByUrl('git_admin/create/user_account');
  }

  getAccountDetails() {
    console.log('running: ' + this.userType);
    switch (this.userType) {
      case UserTypes.BranchAdmin:
        this.user = 'Branch Admin';
        this.getBranchAdminAccounts();
        break;
      case UserTypes.BranchSuperExecutive:
        this.user = 'Branch Super Executive';
        this.getBranchSuperExecutiveAccounts();
        break;
      case UserTypes.CompanyAdmin:
        this.user = 'Company Admin';
        this.getCompanyAdminAccounts();
        break;
      case UserTypes.FrontDesk:
        this.user = 'Front Desk';
        this.getFrontDeskAccounts();
        break;
      case UserTypes.GitAdmin:
        this.user = 'Git Admin';
        this.getGitAdminAccounts();
        break;
      case UserTypes.SuperExecutive:
        this.getSuperExecutiveAccounts();
        break;
      default:
        break;
    }
  }

  getGitAdminAccounts() {
    this.loading = true;
    this.adminService.getGitAdmins().then(
      res => {
        const accounts = res as any;
        console.log('git_admin: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = _.reverse(this.collection);
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getFrontDeskAccounts() {
    if (_.isUndefined(this.merchantId) || _.isNull(this.merchantId)) {
      console.log('git_Admin');
      this.getFrontDeskForGitAdmin();
    }
    else {
      console.log('company_Admin');
      this.getFrontDeskForCompanyAdmin();
    }
  }

  getFrontDeskForGitAdmin() {
    this.loading = true;
    this.frontDeskService.getFrontDeskAccounts().then(
      res => {
        const accounts = res as any;
        console.log('comp_admin: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getFrontDeskForCompanyAdmin() {
    this.loading = true;
    this.adminService.getAllUsersByMerchant(this.userType, this.merchantId).then(
      res => {
        const accounts = res as any;
        console.log('front_desk_comp: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getCompanyAdminAccounts() {
    this.loading = true;
    this.companyService.getCompanyAdmins().then(
      res => {
        const accounts = res as any;
        console.log('comp_admin: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getBranchAdminAccounts() {
    this.loading = true;
    this.branchService.getAllBranchAdmins().then(
      res => {
        const accounts = res as any;
        console.log('branch_admin: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getSuperExecutiveAccounts() {
    this.loading = true;
    this.executiveService.getSuperExecutives().then(
      res => {
        const accounts = res as any;
        console.log('super_exec: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  getBranchSuperExecutiveAccounts() {
    this.loading = true;
    this.executiveService.getBranchSuperExecutives().then(
      res => {
        const accounts = res as any;
        console.log('branch_super_exec: ' + JSON.stringify(accounts));
        this.loading = false;
        this.dataLoaded.emit(accounts);
        this.dataLoadedError.emit(null);
        if (accounts.length > 0) {
          this.hasNoData = false;
          _.forEach(accounts, (admin) => {
            this.collection.push(admin);
          });
          this.allCollection = this.collection;
        }
        else {
          this.hasNoData = true;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
        this.dataLoaded.emit(null);
        this.dataLoadedError.emit(err);
      }
    );
  }

  sort(sort_category: string) {
    switch (sort_category) {
      case 'email':
        this.sortByEmail();
        break;
      case 'status':
        this.sortByStatus();
        break;
      case 'created':
        this.sortByCreated();
        break;
      case 'merchant':
        this.sortByCompany();
        break;
      case 'username':
        this.sortByUsername();
        break;
      default:
        break;
    }
  }

  sortByEmail() {
    this.collection = _.sortBy(this.collection, (item) => item.email);
  }

  sortByStatus() {
    this.collection = _.sortBy(this.collection, (item) => item.status);
  }

  sortByCreated() {
    this.collection = _.sortBy(this.collection, (item) => item.created_at);
  }

  sortByCompany() {
    this.collection = _.sortBy(this.collection, (item) => item.merchant_name);
  }

  sortByUsername() {
    this.collection = _.sortBy(this.collection, (item) => item.username);
  }

}
