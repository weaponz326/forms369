import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/services/branch/branch.service';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { DateTimeService } from 'src/app/services/date-time/date-time.service';

@Component({
  selector: 'app-exec-branches-list-page',
  templateUrl: './exec-branches-list-page.component.html',
  styleUrls: ['./exec-branches-list-page.component.css']
})
export class ExecBranchesListPageComponent implements OnInit {

  loading: boolean;
  hasMore: boolean;
  hasData: boolean;
  hasError: boolean;
  merchantId: string;
  filterState: string;
  loadingMore: boolean;
  hasMoreError: boolean;
  branchesList: Array<any>;
  allBranchesList: Array<any>;

  constructor(
    private branchService: BranchService,
    private dateService: DateTimeService,
    private localStorage: LocalStorageService
  ) {
    this.branchesList = [];
    this.allBranchesList = [];
    this.merchantId = _.toString(this.localStorage.getUser().merchant_id);
    this.getCompanyBranches();
  }

  ngOnInit() {
    this.filterState = 'all';
  }

  handleLoadMoreVisibility(list: Array<any>) {
    _.isNull(list) || _.isUndefined(list) || _.isEmpty(list) || list.length <= 15 ? this.hasMore = false : this.hasMore = true;
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

  checkIfHasMore() {
    return _.isNull(this.branchService.nextPaginationUrl) ? false : true;
  }

  getCompanyBranches() {
    this.loading = true;
    this.branchService.getCompanyBranches(this.merchantId).then(
      res => {
        const branches = res as any;
        this.loading = false;
        this.hasMore = this.checkIfHasMore();
        if (branches.length > 0) {
          this.hasData = true;
          _.forEach(branches, (branch) => {
            branch.created_at = this.dateService.safeDateFormat(branch.created_at);
            this.branchesList.push(branch);
          });
          this.allBranchesList = this.branchesList;
        }
        else {
          this.hasData = false;
        }
      },
      err => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }

  loadMore() {
    this.loadingMore = true;
    const moreUrl = this.branchService.nextPaginationUrl;
    this.branchService.getCompanyBranches(this.merchantId, moreUrl).then(
      res => {
        this.loadingMore = false;
        this.hasMoreError = false;
        const branches = res as any;
        this.hasMore = this.checkIfHasMore();
        _.forEach(branches, (branch) => {
          branch.created_at = this.dateService.safeDateFormat(branch.created_at);
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
    this.getCompanyBranches();
  }

}
