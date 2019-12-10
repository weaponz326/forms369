import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-edit-user-page',
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.css']
})
export class EditUserPageComponent implements OnInit {

  id: string;
  created: boolean;
  userType: string;
  emailInUse: boolean;

  constructor(private router: Router) {
    this.id = window.history.state.id;
  }

  ngOnInit() {
  }

  ok() {
    switch (this.userType) {
      case 'Front Desk':
        this.router.navigateByUrl('/git_admin/lists/front_desk');
        break;
      case 'GIT Admin':
        this.router.navigateByUrl('/git_admin/lists/admin');
        break;
      case 'Branch Admin':
        this.router.navigateByUrl('/git_admin/lists/branch_admin');
        break;
      case 'Company Admin':
        this.router.navigateByUrl('/git_admin/lists/company_admin');
        break;
      case 'Super Executive':
        this.router.navigateByUrl('/git_admin/lists/super_executive');
        break;
      case 'Branch Super Executive':
        this.router.navigateByUrl('/git_admin/lists/branch_executive');
        break;
      default:
        break;
    }
  }

  editAccount(ev: any) {
    console.log('response: ' + ev);
    if (ev == 'email_in_use') {
      this.emailInUse = true;
    }
    else if (ev == 'created') {
      this.created = true;
    }
    else {
      this.created = false;
    }
  }

  getUserType(ev: any) {
    console.log('user_type: ' + UserTypes.SuperExecutive);
    switch (Number(ev)) {
      case UserTypes.BranchAdmin:
        this.userType = 'Branch Admin';
        break;
      case UserTypes.BranchSuperExecutive:
        this.userType = 'Branch Super Executive';
        break;
      case UserTypes.CompanyAdmin:
        this.userType = 'Company Admin';
        break;
      case UserTypes.FrontDesk:
        this.userType = 'Front Desk';
        break;
      case UserTypes.SuperExecutive:
        this.userType = 'Super Executive';
        break;
      case UserTypes.GitAdmin:
        this.userType = 'GIT Admin';
        break;
      default:
        break;
    }
  }

}
