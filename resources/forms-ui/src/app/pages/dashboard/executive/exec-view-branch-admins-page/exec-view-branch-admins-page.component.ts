import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-view-branch-admins-page',
  templateUrl: './exec-view-branch-admins-page.component.html',
  styleUrls: ['./exec-view-branch-admins-page.component.css']
})
export class ExecViewBranchAdminsPageComponent implements OnInit {

  userType: number;
  branchId: number;
  merchantId: number;
  hasNoAccount: boolean;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.userType = UserTypes.BranchAdmin;
    this.branchId = this.localStorage.getUser().branch_id;
    this.merchantId = this.localStorage.getUser().merchant_id;
  }

  ngOnInit() {
  }

  view(id: any) {
    this.router.navigateByUrl('executive/account_details', { state: { id: id } });
  }

  dataLoaded(ev: any) {
    if (_.isNull(ev)) {
      this.hasNoAccount = true;
    }
    else {
      this.hasNoAccount = false;
    }
  }

  dataLoadedError(ev: any) {
    if (_.isNull(ev)) {
      console.log('no error');
    }
    else {
      console.log(ev);
    }
  }

}