import { Component, OnInit } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-create-user-page',
  templateUrl: './admin-create-user-page.component.html',
  styleUrls: ['./admin-create-user-page.component.css']
})
export class AdminCreateUserPageComponent implements OnInit {
  created: boolean;
  userType: string;
  emailInUse: boolean;
  usernameInUse: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    this.router.navigateByUrl('/admin');
  }

  bringBackForm() {
    this.created = !this.created;
  }

  createAccount(ev: any) {
    console.log('response: ' + ev);
    if (ev == 'email_in_use') {
      this.emailInUse = true;
    }
    else if (ev == 'username_in_use') {
      this.usernameInUse = true;
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
      default:
        break;
    }
  }

}
