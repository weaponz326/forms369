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

  goBack() {
    this.router.navigateByUrl('/git_admin/lists/admin');
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
      default:
        break;
    }
  }

}
