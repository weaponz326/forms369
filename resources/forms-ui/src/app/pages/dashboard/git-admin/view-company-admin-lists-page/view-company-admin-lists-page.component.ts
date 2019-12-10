import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-company-admin-lists-page',
  templateUrl: './view-company-admin-lists-page.component.html',
  styleUrls: ['./view-company-admin-lists-page.component.css']
})
export class ViewCompanyAdminListsPageComponent implements OnInit {

  userType: number;
  hasNoAccount: boolean;

  constructor(private router: Router) {
    this.userType = UserTypes.CompanyAdmin;
  }

  ngOnInit() {
  }

  edit(id: any) {
    this.router.navigateByUrl('/git_admin/edit/user_account', { state: { id: id }});
  }

  view(id: any) {
    this.router.navigateByUrl('git_admin/details/user_account', { state: { id: id }});
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
