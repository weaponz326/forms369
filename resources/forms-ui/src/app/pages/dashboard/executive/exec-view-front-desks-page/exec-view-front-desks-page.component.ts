import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-exec-view-front-desks-page',
  templateUrl: './exec-view-front-desks-page.component.html',
  styleUrls: ['./exec-view-front-desks-page.component.css']
})
export class ExecViewFrontDesksPageComponent implements OnInit {
  userType: number;
  branchId: number;
  canEdit: boolean;
  canDelete: boolean;
  merchantId: number;
  hasNoAccount: boolean;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {
    this.userType = UserTypes.FrontDesk;
    this.branchId = this.localStorage.getUser().branch_id;
    this.merchantId = this.localStorage.getUser().merchant_id;
  }

  ngOnInit() {
  }

  view(id: any) {
    this.router.navigateByUrl('admin/details/account', { state: { id: id } });
  }

  edit(id: any) {
    this.router.navigateByUrl('executive/edit/account', { state: { id: id }});
  }

  delete(ev: any) {}

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
