import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AdminService } from 'src/app/services/admin/admin.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-settings-page',
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.css']
})
export class AdminSettingsPageComponent implements OnInit {
  user: Users;
  frontDesks: any;
  loading: boolean;
  hasError: boolean;
  submitted: boolean;
  isLoading: boolean;
  superExecutives: any;
  hasFrontDesk: boolean;
  hasSuperExecs: boolean;
  canDownloadForm: FormGroup;
  frontDeskLists: Array<any>;
  superExecLists: Array<any>;
  hasBranchSuperExecs: boolean;
  branchSuperExecLists: Array<any>;
  selectedFrontDesks: Array<string>;
  selectedSuperExecutives: Array<string>;
  selectedBranchSuperExecs: Array<string>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private localStorage: LocalStorageService,
    private executiveService: ExecutiveService
  ) {
    this.frontDesks = [];
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

  public get f() {
    return this.canDownloadForm.controls;
  }

  public get front_desk() {
    return this.f.canDownload as FormArray;
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
    if (this.frontDesks[0] == true) {
      if (!_.includes(this.selectedFrontDesks, id)) {
        this.selectedFrontDesks.push(id);
      }
    }
    else {
      if (_.includes(this.selectedFrontDesks, id)) {
        this.selectedFrontDesks = _.filter(this.selectedFrontDesks, (_id) => id != id);
      }
    }
  }

  onCanDownloadSuperExecutive(e: any, id: string) {
    console.log(e);
  }

  getCanDownloadData() {}

  saveCanDownload() {
    const front_desks = this.canDownloadForm.value.canDownload.map((v, i) => (v ? this.frontDeskLists[i].id : null))
    .filter(v => v !== null);
    console.log(front_desks);
  }

  save() {
    console.log('selected: ' + this.frontDesks);
    console.log('selected_1: ' + this.selectedFrontDesks);
    // this.saveCanDownload();
  }

}
