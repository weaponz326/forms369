import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-view-executive-lists-page',
  templateUrl: './view-executive-lists-page.component.html',
  styleUrls: ['./view-executive-lists-page.component.css']
})
export class ViewExecutiveListsPageComponent implements OnInit {
  userType: number;
  hasNoAccount: boolean;
  isDeleteSuccess: boolean;
  showDeleteMessage: boolean;
  loadingModalRef: NgbModalRef;
  @ViewChild('confirm', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('loading', { static: false }) loadingModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private accountService: AccountService
  ) {
    this.userType = UserTypes.SuperExecutive;
  }

  ngOnInit() {
  }

  showLoadingDialog() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingDialog() {
    this.loadingModalRef.close();
  }

  handleAlertTimeout() {
    setTimeout(() => {
      this.showDeleteMessage = false;
    }, 5000);
  }

  edit(id: any) {
    this.router.navigateByUrl('/git_admin/edit/user_account', { state: { id: id }});
  }

  view(id: any) {
    this.router.navigateByUrl('git_admin/details/user_account', { state: { id: id }});
  }

  delete(id: any) {
    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {
        if (result == 'delete') {
          this.deleteUser(id);
        }
      }
    );
  }

  deleteUser(id: any) {
    this.showLoadingDialog();
    this.accountService.deleteAccount(id).then(
      ok => {
        if (ok) {
          this.hideLoadingDialog();
          this.showDeleteMessage = true;
          this.isDeleteSuccess = true;
          this.handleAlertTimeout();
        }
      },
      err => {
        this.hideLoadingDialog();
        this.showDeleteMessage = true;
        this.isDeleteSuccess = false;
        this.handleAlertTimeout();
      }
    );
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
