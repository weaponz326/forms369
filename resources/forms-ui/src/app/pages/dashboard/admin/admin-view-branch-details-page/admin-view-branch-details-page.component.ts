import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
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
    private router: Router,
    private branchService: BranchService
  ) {
    this.branch = window.history.state.branch;
    this.isActive = this.branch.status == 1 ? true : false;
    console.log(this.branch);
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
