import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

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

  constructor(
    private router: Router,
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

  loadMore() {}

}
