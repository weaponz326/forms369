import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
// import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-view-executive-lists-page',
  templateUrl: './view-executive-lists-page.component.html',
  styleUrls: ['./view-executive-lists-page.component.css']
})
export class ViewExecutiveListsPageComponent implements OnInit {
  userType: number;
  hasNoAccount: boolean;

  constructor(private router: Router) {
    this.userType = UserTypes.SuperExecutive;
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
