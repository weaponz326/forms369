import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-form-creator-lists-page',
  templateUrl: './view-form-creator-lists-page.component.html',
  styleUrls: ['./view-form-creator-lists-page.component.css']
})
export class ViewFormCreatorListsPageComponent implements OnInit {

  userType: number;
  hasNoAccount: boolean;

  constructor(private router: Router) {
    this.userType = UserTypes.FormCreator;
  }

  ngOnInit() {
  }

  edit(id: any) {
    this.router.navigateByUrl('/git_admin/edit/user_account', { state: { id: id } });
  }

  view(id: any) {
    this.router.navigateByUrl('git_admin/details/user_account', { state: { id: id } });
  }

  delete(id: any) { }

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
