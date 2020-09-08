import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-edit-user-page',
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.css']
})
export class EditUserPageComponent implements OnInit {

  id: string;
  url: string;
  created: boolean;
  userType: string;
  emailInUse: boolean;

  constructor(private router: Router) {
    this.id = window.history.state.id;
  }

  ngOnInit() {
  }

  ok() {
    this.router.navigateByUrl(this.url);
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
        this.url = '/git_admin/lists/branch_admin';
        break;
      case UserTypes.BranchSuperExecutive:
        this.userType = 'Branch Super Executive';
        this.url = '/git_admin/lists/branch_executive';
        break;
      case UserTypes.CompanyAdmin:
        this.userType = 'Company Admin';
        this.url = '/git_admin/lists/company_admin';
        break;
      case UserTypes.FrontDesk:
        this.userType = 'Front Desk';
        this.url = '/git_admin/lists/front_desk';
        break;
      case UserTypes.SuperExecutive:
        this.userType = 'Super Executive';
        this.url = '/git_admin/lists/super_executive';
        break;
      case UserTypes.GitAdmin:
        this.userType = 'GIT Admin';
        this.url = '/git_admin/lists/admin';
        break;
      case UserTypes.FormCreator:
        this.userType = 'Form Creator';
        this.url = '/git_admin/lists/form_creator';
        break;
      default:
        break;
    }
  }

}
