import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/services/account/account.service';

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
  @Input() branchId: any;
  @Input() merchantId: any;
  @Input() canEdit: boolean;
  @Input() canView: boolean;
  @Input() canDelete: boolean;
  isDeleteSuccess: boolean;
  showDeleteMessage: boolean;
  collection: Array<any>;
  allCollection: Array<any>;
  loadingModalRef: NgbModalRef;
  @Output() edit = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() dataLoaded = new EventEmitter();
  @Output() dataLoadedError = new EventEmitter();
  @ViewChild('loader', { static: false }) loadingModal: TemplateRef<any>;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private adminService: AdminService,
    private branchService: BranchService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private frontDeskService: FrontDeskService,
    private executiveService: ExecutiveService
  ) {
    this.collection = [];
    this.allCollection = [];

    this.handleActionButtonsVisibility();
  }

  ngOnInit() {
    this.filterState = 'all';
    this.getAccountDetails();
  }

  handleActionButtonsVisibility() {
    if (_.isUndefined(this.canEdit)) {
      this.canEdit = true;
    }

    if (_.isUndefined(this.canView)) {
      this.canView = true;
    }

    if (_.isUndefined(this.canDelete)) {
      this.canDelete = true;
    }
  }

  showLoadingDialog() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingDialog() {
    this.loadingModalRef.close();
  }

  handleAlertTimeout() {
    setTimeout(() => {
      this.showDeleteMessage = false;
    }, 5000);
  }

  _edit(id: string) {
    this.edit.emit(id);
  }

  _view(id: string) {
    this.view.emit(id);
  }

  _delete(id: string, index: number) {
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'delete') {
          this.deleteUser(id, index);
        }
      }
    );
  }

  deleteUser(id: any, index: number) {
    this.showLoadingDialog();
    this.accountService.deleteAccount(id).then(
      ok => {
        if (ok) {
          this.hideLoadingDialog();
          this.showDeleteMessage = true;
          this.isDeleteSuccess = true;
          this.handleAlertTimeout();
          this.collection.splice(index, 1);
        }
      },
      err => {
        this.hideLoadingDialog();
        this.showDeleteMessage = true;
        this.isDeleteSuccess = false;
        this.handleAlertTimeout();
      }
    );
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
      if (_.isUndefined(this.branchId) || _.isNull(this.branchId) || this.branchId == 0) {
        console.log('company_Admin');
        this.getFrontDeskForCompanyAdmin();
      }
      else {
        console.log('branch_Admin');
        this.getFrontDeskForBranchAdmin();
      }
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

  getFrontDeskForBranchAdmin() {
    this.loading = true;
    this.adminService.getAllUsersByBranch(this.userType, this.branchId).then(
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
    if (_.isUndefined(this.merchantId) && _.isUndefined(this.branchId)) {
      console.log('is GitAdmin');
      this.getCompanyAdminForGitAdmin();
    }
    else {
      console.log('is company or branch admin');
      this.getCompanyAdminForCompAdmin();
    }
  }

  getCompanyAdminForGitAdmin() {
    this.loading = true;
    this.companyService.getAllCompanyAdmins().then(
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

  getCompanyAdminForCompAdmin() {
    this.loading = true;
    this.companyService.getCompanyAdmins(this.merchantId).then(
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
    if (this.branchId == 0 || _.isNull(this.branchId)) {
      console.log('is company admin');
      console.log('has branch id: ' + this.branchId);
      this.getBranchAdminForCompAdmin();
    }
    else if (!_.isUndefined(this.merchantId) && this.merchantId > 0) {
      console.log('is branch admin');
      console.log('has branch id: ' + this.merchantId);
      this.getBranchAdminForBranchAdmin();
    }
    else {
      console.log('is GitAdmin');
      console.log('has branch id: ' + this.branchId + 'and merchant id: ' + this.merchantId);
      this.getBranchAdminForGitAdmin();
    }
  }

  getBranchAdminForGitAdmin() {
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

  getBranchAdminForCompAdmin() {
    this.loading = true;
    this.branchService.getBranchAdmins(this.merchantId, true).then(
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

  getBranchAdminForBranchAdmin() {
    this.loading = true;
    this.branchService.getBranchAdmins(this.branchId, false).then(
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
    if (_.isUndefined(this.merchantId) && _.isUndefined(this.branchId)) {
      console.log('is GitAdmin');
      this.getSuperExecutiveForGitAdmin();
    }
    else {
      console.log('is company or branch admin');
      this.getSuperExecutiveForCompAdmin();
    }
  }

  getSuperExecutiveForGitAdmin() {
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

  getSuperExecutiveForCompAdmin() {
    this.loading = true;
    this.executiveService.getCompanySuperExecutives(this.merchantId).then(
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
    if (_.isUndefined(this.merchantId) && _.isUndefined(this.branchId)) {
      console.log('is GitAdmin');
      this.getBranchExecutiveForGitAdmin();
    }
    else {
      console.log('is company or branch admin');
      this.getBranchExecutiveForCompAdmin();
    }
  }

  getBranchExecutiveForGitAdmin() {
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

  getBranchExecutiveForCompAdmin() {
    this.loading = true;
    this.executiveService.getCompanyBranchSuperExecutives(this.merchantId).then(
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

  retry() {
    this.getAccountDetails();
  }

}
