import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch/branch.service';
import { ListViewService } from 'src/app/services/view/list-view.service';
import { EndpointService } from 'src/app/services/endpoint/endpoint.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-view-branch-lists-page',
  templateUrl: './view-branch-lists-page.component.html',
  styleUrls: ['./view-branch-lists-page.component.css'],
  providers: [BranchService, EndpointService]
})
export class ViewBranchListsPageComponent implements OnInit {

  user: Users;
  company: any;
  viewMode: string;
  loading: boolean;
  hasMore: boolean;
  hasError: boolean;
  hasNoData: boolean;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  isFormCreator: boolean;
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
    this.user = this.localStorage.getUser();
    this.viewMode = this.listViewService.getDesiredViewMode();
    this.isFormCreator = this.user.usertype == UserTypes.FormCreator ? true : false;
    this.getBranches();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  handleLoadMoreVisibility(list: Array<any>) {
    _.isNull(list) || _.isUndefined(list) || _.isEmpty(list) || list.length <= 15 ? this.hasMore = false : this.hasMore = true;
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
      case 'merchant':
        this.sortByCompany();
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

  sortByCompany() {
    this.branchesList = _.sortBy(this.branchesList, (item) => item.merchant_name);
  }

  showAll() {
    this.filterState = 'all';
    this.branchesList = this.allBranchesList;
    const moreUrl = this.branchService.nextPaginationUrl;
    _.isNull(moreUrl) ? this.hasMore = false : this.hasMore = true;
  }

  showActive() {
    this.filterState = 'active';
    this.branchesList = _.filter(this.allBranchesList, (branch) =>  branch.status == 1);
    this.hasMore ? this.handleLoadMoreVisibility(this.branchesList) : null;
  }

  showInActive() {
    this.filterState = 'inactive';
    this.branchesList = _.filter(this.allBranchesList, (branch) =>  branch.status == 0);
    this.hasMore ? this.handleLoadMoreVisibility(this.branchesList) : null;
  }

  openForms(id: string) {
    this.router.navigateByUrl('git_admin/lists/form', { state: { company: id }});
  }

  openNewBranch() {
    this.router.navigateByUrl('git_admin/create/branch');
  }

  edit(ev: any, branch: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('git_admin/edit/branch', { state: { branch: branch }});
  }

  view(ev: any, branch: any) {
    ev.stopPropagation();
    this.router.navigateByUrl('git_admin/details/branch', { state: { branch: branch }});
  }

  delete(ev: any, id: string) {
    ev.stopPropagation();
  }

  checkIfHasMore() {
    return _.isNull(this.branchService.nextPaginationUrl) ? false : true;
  }

  getBranches() {
    if (_.isUndefined(window.history.state.company)) {
      this.getAllBranches();
    }
    else {
      this.company = window.history.state.company;
      this.getCompanyBranches();
    }
  }

  getCompanyBranches() {
    this.loading = true;
    this.branchService.getCompanyBranches(this.company.id).then(
      res => {
        const branches = res as any;
        this.hasMore = this.checkIfHasMore();
        if (branches.length > 0) {
          this.hasNoData = false;
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.allBranchesList = _.reverse(this.branchesList);
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
        this.hasMore = this.checkIfHasMore();
        if (branches.length > 0) {
          this.hasNoData = false;
          _.forEach(branches, (branch) => {
            this.branchesList.push(branch);
            this.allBranchesList = _.reverse(this.branchesList);
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

  loadMore() {
    if (_.isUndefined(window.history.state.company)) {
      this.loadMoreAllBranches();
    }
    else {
      this.company = window.history.state.company;
      this.loadMoreCompanyBranches();
    }
  }

  loadMoreAllBranches() {
    this.loadingMore = true;
    const moreUrl = this.branchService.nextPaginationUrl;
    this.branchService.getAllBranches(moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const branches = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(branches, (branch) => {
          this.branchesList.push(branch);
          this.allBranchesList = _.reverse(this.branchesList);
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  loadMoreCompanyBranches() {
    this.loadingMore = true;
    const moreUrl = this.branchService.nextPaginationUrl;
    this.branchService.getCompanyBranches(this.company.id, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const branches = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(branches, (branch) => {
          this.branchesList.push(branch);
          this.allBranchesList = this.branchesList;
        });
      },
      err => {
        this.loadingMore = false;
        this.hasMoreError = true;
      }
    );
  }

  retry() {
    this.getBranches();
  }

}
