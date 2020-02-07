import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-view-front-desks-page',
  templateUrl: './admin-view-front-desks-page.component.html',
  styleUrls: ['./admin-view-front-desks-page.component.css']
})
export class AdminViewFrontDesksPageComponent implements OnInit {
  userType: number;
  branchId: number;
  canEdit: boolean;
  merchantId: number;
  hasNoAccount: boolean;

  constructor(private router: Router, private localStorage: LocalStorageService) {
    this.userType = UserTypes.FrontDesk;
    this.branchId = this.localStorage.getUser().branch_id;
    this.merchantId = this.localStorage.getUser().merchant_id;
  }

  ngOnInit() {
    this.canEdit = this.localStorage.getUser().usertype == UserTypes.BranchAdmin
      ? false
      : true;
  }

  edit(id: any) {
    this.router.navigateByUrl('admin/edit/account', { state: { id: id }});
  }

  view(id: any) {
    this.router.navigateByUrl('admin/details/account', { state: { id: id }});
  }

  delete(id: any) {}

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
