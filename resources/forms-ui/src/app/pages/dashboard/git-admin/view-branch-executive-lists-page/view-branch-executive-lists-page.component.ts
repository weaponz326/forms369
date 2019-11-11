import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-view-branch-executive-lists-page',
  templateUrl: './view-branch-executive-lists-page.component.html',
  styleUrls: ['./view-branch-executive-lists-page.component.css']
})
export class ViewBranchExecutiveListsPageComponent implements OnInit {

  userType: number;
  hasNoAccount: boolean;

  constructor() {
    this.userType = UserTypes.BranchSuperExecutive;
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
