import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { AdminService } from 'src/app/services/admin/admin.service';
import { BranchService } from 'src/app/services/branch/branch.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ExecutiveService } from 'src/app/services/executive/executive.service';
import { FrontDeskService } from 'src/app/services/front-desk/front-desk.service';

@Component({
  selector: 'app-exec-accounts-list-page',
  templateUrl: './exec-accounts-list-page.component.html',
  styleUrls: ['./exec-accounts-list-page.component.css']
})
export class ExecAccountsListPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
