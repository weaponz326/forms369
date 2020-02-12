import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AdminService } from 'src/app/services/admin/admin.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-settings-page',
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.css']
})
export class AdminSettingsPageComponent implements OnInit {
  user: Users;
  loading: boolean;
  hasError: boolean;
  submitting: boolean;
  isLoading: boolean;
  hasFrontDesk: boolean;
  hasSuperExecs: boolean;
  frontDeskLists: Array<any>;
  superExecLists: Array<any>;
  hasBranchSuperExecs: boolean;
  branchSuperExecLists: Array<any>;
  selectedFrontDesks: Array<string>;
  selectedSuperExecutives: Array<string>;
  selectedBranchSuperExecs: Array<string>;

  constructor(
    private router: Router,
    private logging: LoggingService,
    private adminService: AdminService,
    private localStorage: LocalStorageService,
    private executiveService: ExecutiveService
  ) {
    this.frontDeskLists = [];
    this.superExecLists = [];
    this.selectedFrontDesks = [];
    this.branchSuperExecLists = [];
    this.selectedSuperExecutives = [];
    this.selectedBranchSuperExecs = [];
    this.user = this.localStorage.getUser();
  }

  ngOnInit() {
    this.getFrontDesks();
    this.getSuperExecutives();
    this.getBranchSuperExecutives();
  }

  showCanDownloadSavedAlert() {
    Swal.fire({
      title: 'Saved Settings',
      icon: 'success',
      text: 'Settings have been successfully saved!',
      confirmButtonText: 'Ok'
    });
  }

  showCanDownloadFailedAlert() {
    Swal.fire({
      title: 'Oops!',
      icon: 'error',
      text: 'Failed to save settings. Please make sure you still have an active internet connection or our servers may be down.',
      confirmButtonText: 'Arrrgh, Ok'
    });
  }

  getFrontDesks() {
    this.loading = true;
    const user_type = UserTypes.FrontDesk;
    this.adminService.getAllUsersByMerchant(user_type, this.user.merchant_id.toString()).then(
      accounts => {
        console.log('front_desk_comp: ' + JSON.stringify(accounts));
        this.loading = false;
        if (accounts.length == 0) {
          this.hasFrontDesk = false;
        }
        else {
          this.hasFrontDesk = true;
          _.forEach(accounts, (front_desk) => {
            this.frontDeskLists.push(front_desk);
          });
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  getSuperExecutives() {
    this.loading = true;
    this.executiveService.getCompanySuperExecutives(this.user.merchant_id.toString()).then(
      accounts => {
        console.log('super_exec: ' + JSON.stringify(accounts));
        this.loading = false;
        if (accounts.length == 0) {
          this.hasSuperExecs = false;
        }
        else {
          this.hasSuperExecs = true;
          _.forEach(accounts, (super_exec) => {
            this.superExecLists.push(super_exec);
          });
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  getBranchSuperExecutives() {
    this.loading = true;
    this.executiveService.getCompanyBranchSuperExecutives(this.user.merchant_id.toString()).then(
      accounts => {
        console.log('branch_super_exec: ' + JSON.stringify(accounts));
        this.loading = false;
        if (accounts.length == 0) {
          this.hasBranchSuperExecs = false;
        }
        else {
          this.hasBranchSuperExecs = true;
          _.forEach(accounts, (super_exec) => {
            this.branchSuperExecLists.push(super_exec);
          });
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  onCanDownloadFrontDesk(e: any, id: string) {
    if (e.target.checked == true) {
      if (!_.includes(this.selectedFrontDesks, id)) {
        this.selectedFrontDesks.push(id);
      }
    }
    else {
      if (_.includes(this.selectedFrontDesks, id)) {
        this.selectedFrontDesks = _.filter(this.selectedFrontDesks, (_id) => id != _id);
      }
    }
  }

  onCanDownloadSuperExecutive(e: any, id: string) {
    console.log(e);
    if (e.target.checked == true) {
      if (!_.includes(this.selectedSuperExecutives, id)) {
        this.selectedSuperExecutives.push(id);
      }
    }
    else {
      if (_.includes(this.selectedSuperExecutives, id)) {
        this.selectedSuperExecutives = _.filter(this.selectedSuperExecutives, (_id) => id != _id);
      }
    }
  }

  onCanDownloadBranchSuperExec(e: any, id: string) {
    console.log(e);
    if (e.target.checked == true) {
      if (!_.includes(this.selectedBranchSuperExecs, id)) {
        this.selectedBranchSuperExecs.push(id);
      }
    }
    else {
      if (_.includes(this.selectedBranchSuperExecs, id)) {
        this.selectedBranchSuperExecs = _.filter(this.selectedBranchSuperExecs, (_id) => id != _id);
      }
    }
  }

  getCanDownloadData() {
    const account_ids = [];
    const front_desk_accounts = this.selectedFrontDesks;
    const super_exec_accounts = this.selectedSuperExecutives;
    const branch_super_exec_accounts = this.selectedBranchSuperExecs;

    _.forEach(front_desk_accounts, (account) => {
      account_ids.push(account);
    });
    _.forEach(super_exec_accounts, (account) => {
      account_ids.push(account);
    });
    _.forEach(branch_super_exec_accounts, (account) => {
      account_ids.push(account);
    });

    return this.prepareCanDownloadData(account_ids);
  }

  submitCanDownloadSettings() {
    this.submitting = true;
    const ids = this.getCanDownloadData();
    this.submitAllCanDownload(ids).then(
      ok => {
        this.submitting = false;
        ok
          ? this.showCanDownloadSavedAlert()
          : this.showCanDownloadFailedAlert();
      },
      err => {
        this.showCanDownloadFailedAlert();
      }
    );
  }

  submitAllCanDownload(ids: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promiseArray: Array<Promise<any>> = [];
      _.forEach(ids, (id) => {
        const promise = this.adminService.setupCanDownloadPermission(id, 1);
        promiseArray.push(promise);
      });

      Promise.all(promiseArray).then(
        done => {
          this.logging.log('done: ' + done);
          this.logging.log('all can download settings saved');
          resolve(true);
        },
        err => {
          this.logging.log('error___: ' + JSON.stringify(err));
          this.logging.log('failed executing all can download');
          resolve(false);
        }
      );
    });
  }

  prepareCanDownloadData(ids: string[]) {
    const final_data = _.filter(ids, (_id) => _id != '' || _id != null || _id != undefined);
    console.log('dddddddd: ' + JSON.stringify(final_data));
    return final_data;
  }

  save() {
    console.log('selected: ' + this.selectedFrontDesks);
    this.submitCanDownloadSettings();
  }

}
