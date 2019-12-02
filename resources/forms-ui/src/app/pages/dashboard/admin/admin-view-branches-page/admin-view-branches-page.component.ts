import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch/branch.service';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';

@Component({
  selector: 'app-admin-view-branches-page',
  templateUrl: './admin-view-branches-page.component.html',
  styleUrls: ['./admin-view-branches-page.component.css']
})
export class AdminViewBranchesPageComponent implements OnInit {

  viewMode: string;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  merchant_id: number;
  branchesList: Array<any>;
  allBranchesList: Array<any>;

  constructor(
    private router: Router,
    private branchService: BranchService,
    private listViewService: ListViewService,
    private localStorage: LocalStorageService
  ) {
    this.branchesList = [];
    this.allBranchesList = [];
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.merchant_id = this.localStorage.getUser().merchant_id;
    this.getCompanyBranches();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  toggleViewMode(mode: string) {
    switch (mode) {
      case 'list':
        this.viewMode = 'list';
        this.listViewService.setDesiredViewMode('list');
        break;
      case 'grid':
        this.viewMode = 'grid';
        this.listViewService.setDesiredViewMode('grid');
        break;
      default:
        break;
    }
  }

  sort(sort_category: string) {
    switch (sort_category) {
      case 'created':
        this.sortByCreated();
        break;
      case 'branch':
        this.sortByBranch();
        break;
      default:
        break;
    }
  }

  sortByCreated() {
    this.branchesList = _.sortBy(this.branchesList, (item) => item.created_at);
  }

  sortByBranch() {
    this.branchesList = _.sortBy(this.branchesList, (item) => item.branch_name);
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
    this.router.navigateByUrl('admin/create/branch');
  }

  view(branch: any) {
    this.router.navigateByUrl('admin/details/branch', { state: { branch: branch }});
  }

  edit(branch: any) {
    this.router.navigateByUrl('admin/edit/branch/' + branch.id, { state: { branch: branch }});
  }

  delete(id: string) {}

  getCompanyBranches() {
    this.loading = true;
    this.branchService.getBranch(_.toString(this.merchant_id)).then(
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

  retry() {
    this.getCompanyBranches();
  }

}
