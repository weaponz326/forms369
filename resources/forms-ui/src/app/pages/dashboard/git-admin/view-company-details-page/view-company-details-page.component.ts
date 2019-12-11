import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-view-company-details-page',
  templateUrl: './view-company-details-page.component.html',
  styleUrls: ['./view-company-details-page.component.css']
})
export class ViewCompanyDetailsPageComponent implements OnInit {

  id: string;
  company: any;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {
    this.company = window.history.state.company;
    this.isActive = this.company.status == 1 ? true : false;
    this.id = this.company.id;
    console.log('comp:' + this.company);
  }

  ngOnInit() {
  }

  edit(id: string) {
    this.router.navigateByUrl('/git_admin/edit/company', { state: { company: this.company }});
  }

  toggleStatus() {
    this.isActive ? this.disableCompany() : this.enableCompany();
  }

  enableCompany() {
    this._loading = true;
    this.companyService.enableCompany(this.id).then(
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
    this.companyService.disableCompany(this.id).then(
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
