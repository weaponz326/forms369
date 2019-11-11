import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-view-branch-admin-lists-page',
  templateUrl: './view-branch-admin-lists-page.component.html',
  styleUrls: ['./view-branch-admin-lists-page.component.css']
})
export class ViewBranchAdminListsPageComponent implements OnInit {

  userType: number;
  hasNoAccount: boolean;

  constructor() {
    this.userType = UserTypes.BranchAdmin;
  }

  ngOnInit() {
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
