import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-view-company-details-page',
  templateUrl: './view-company-details-page.component.html',
  styleUrls: ['./view-company-details-page.component.css'],
  providers: [AccountService]
})
export class ViewCompanyDetailsPageComponent implements OnInit {

  id: string;
  company: any;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.company = this.router.getCurrentNavigation().extras.state.company;
    this.isActive = this.company.status == 1 ? true : false;
    console.log(this.company);
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigateByUrl('/git_admin/edit/company', { state: { id: id }});
  }

  toggleStatus() {
    this.isActive ? this.disableCompany() : this.enableCompany();
  }

  enableCompany() {
    this._loading = true;
    this.accountService.enableAccount(this.id).then(
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
    this.accountService.disableAccount(this.id).then(
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
