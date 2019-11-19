import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-view-front-desks-page',
  templateUrl: './admin-view-front-desks-page.component.html',
  styleUrls: ['./admin-view-front-desks-page.component.css']
})
export class AdminViewFrontDesksPageComponent implements OnInit {
  userType: number;
  merchantId: number;
  hasNoAccount: boolean;

  constructor(private localStorage: LocalStorageService) {
    this.userType = UserTypes.FrontDesk;
    this.merchantId = this.localStorage.getUser().merchant_id;
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
