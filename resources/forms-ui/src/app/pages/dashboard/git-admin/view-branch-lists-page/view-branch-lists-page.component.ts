import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyBranches } from 'src/app/models/company-branches.model';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';

@Component({
  selector: 'app-view-branch-lists-page',
  templateUrl: './view-branch-lists-page.component.html',
  styleUrls: ['./view-branch-lists-page.component.css'],
  providers: [BranchService, EndpointService]
})
export class ViewBranchListsPageComponent implements OnInit {

  company: any;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  branchesList: Array<CompanyBranches>;
  allBranchesList: Array<CompanyBranches>;

  constructor(
    private router: Router,
    private branchService: BranchService
  ) {
    this.branchesList = [];
    this.allBranchesList = [];
    this.getBranches();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  showAll() {
    this.filterState = 'all';
    this.branchesList = this.allBranchesList;
  }

  showActive() {
    this.filterState = 'active';
    this.branchesList = _.filter(this.allBranchesList, (branch) =>  branch.status == 1);
  }

  showInActive() {
    this.filterState = 'inactive';
    this.branchesList = _.filter(this.allBranchesList, (branch) =>  branch.status == 0);
  }

  openNewBranch() {
    this.router.navigateByUrl('git_admin/create/branch');
  }

  edit(branch: any) {
    this.router.navigateByUrl('git_admin/edit/branch/' + branch.id, { state: { branch: branch }});
  }

  view(branch: any) {}

  delete(id: string) {}

  getBranches() {
    if (_.isUndefined(this.router.getCurrentNavigation().extras.state)) {
      this.getAllBranches();
    }
    else {
      this.company = this.router.getCurrentNavigation().extras.state.company;
      this.getCompanyBranches();
    }
  }

  getCompanyBranches() {
    this.loading = true;
    this.branchService.getBranch(this.company.id).then(
      res => {
        const branches = res as any;
        if (branches.length > 0) {
          this.hasNoData = false;
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.allBranchesList = this.branchesList;
          });
        }
        else {
          this.hasNoData = true;
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  getAllBranches() {
    this.loading = true;
    this.branchService.getAllBranches().then(
      res => {
        const branches = res as any;
        if (branches.length > 0) {
          this.hasNoData = false;
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.allBranchesList = this.branchesList;
          });
        }
        else {
          this.hasNoData = true;
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  loadMore() {}

}
