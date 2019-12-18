import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/services/branch/branch.service';

@Component({
  selector: 'app-admin-view-branch-details-page',
  templateUrl: './admin-view-branch-details-page.component.html',
  styleUrls: ['./admin-view-branch-details-page.component.css']
})
export class AdminViewBranchDetailsPageComponent implements OnInit {

  id: string;
  branch: any;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;

  constructor(
    private branchService: BranchService
  ) {
    this.branch = window.history.state.branch;
    this.resolveReloadDataLoss();
    this.isActive = this.branch.status == 1 ? true : false;
    console.log(this.branch);
  }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this.branch)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_data', JSON.stringify(this.branch));
    }
    else {
      this.branch = JSON.parse(sessionStorage.getItem('u_data'));
    }
  }

  ngOnInit() {
  }

  toggleStatus() {
    this.isActive ? this.disableCompany() : this.enableCompany();
  }

  enableCompany() {
    this._loading = true;
    this.branchService.enableBranch(this.id).then(
      res => {
        this.isActive = true;
        this._loading = false;
      },
      err => {
        this._loading = false;
      }
    );
  }

  disableCompany() {
    this._loading = true;
    this.branchService.disableBranch(this.id).then(
      res => {
        this.isActive = false;
        this._loading = false;
      },
      err => {
        this._loading = false;
      }
    );
  }

}
