import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-view-front-desk-lists-page',
  templateUrl: './view-front-desk-lists-page.component.html',
  styleUrls: ['./view-front-desk-lists-page.component.css']
})
export class ViewFrontDeskListsPageComponent implements OnInit {

  userType: number;
  hasNoAccount: boolean;

  constructor() {
    this.userType = UserTypes.FrontDesk;
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
