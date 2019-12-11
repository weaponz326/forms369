import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-access-code-page',
  templateUrl: './view-access-code-page.component.html',
  styleUrls: ['./view-access-code-page.component.css']
})
export class ViewAccessCodePageComponent implements OnInit {
  loading: boolean;
  hasData: boolean;
  hasMore: boolean;
  hasError: boolean;
  loadingMore: boolean;
  hasMoreError: boolean;
  accessCodesList: Array<any>;
  loadingModalRef: NgbModalRef;
  @ViewChild('loader', {static: false}) loadingModal: TemplateRef<any>;
  @ViewChild('confirmActivate', {static: false}) activateModal: TemplateRef<any>;
  @ViewChild('confirmDeactivate', {static: false}) deactivateModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private accountService: AccountService
  ) {
    this.accessCodesList = [];
    this.getAllAccessCodes();
  }

  ngOnInit() {
  }

  open(code: any) {
    this.router.navigateByUrl('/git_admin/edit/access_code', { state: { code: code }});
  }

  showLoadingModal() {
    this.loadingModalRef = this.modalService.open(this.loadingModal, { centered: true });
  }

  hideLoadingModal() {
    this.loadingModalRef.close();
  }

  getAllAccessCodes() {
    this.loading = true;
    this.accountService.getAllAccessCodes().then(
      codes => {
        if (codes.length != 0) {
          this.hasData = true;
          this.loading = false;
          _.forEach(codes, (code) => {
            this.accessCodesList.push(code);
          });
        }
        else {
          this.hasData = false;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  activate(code: string) {
    console.log('access_code: ' + code);
    this.modalService.open(this.activateModal, { centered: true }).result.then(
      result => {
        if (result == 'activate') {
          this.accessCodeActivate(code);
        }
      }
    );
  }

  deactivate(code: string) {
    this.modalService.open(this.deactivateModal, { centered: true }).result.then(
      result => {
        if (result == 'deactivate') {
          this.accessCodeDeactivate(code);
        }
      }
    );
  }

  accessCodeActivate(code: string) {
    this.showLoadingModal();
    this.accountService.activateAccessCode(code).then(
      ok => {
        if (ok) {
          this.hideLoadingModal();
          this.accessCodesList = [];
          this.getAllAccessCodes();
        }
      }
    );
  }

  accessCodeDeactivate(code: string) {
    this.showLoadingModal();
    this.accountService.deActivateAccessCode(code).then(
      ok => {
        if (ok) {
          this.hideLoadingModal();
          this.accessCodesList = [];
          this.getAllAccessCodes();
        }
      }
    );
  }

  loadMore() {}

}
