import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isAdmin: boolean;
  isClient: boolean;
  isGitAdmin: boolean;
  isExecutive: boolean;
  isFrontDesk: boolean;
  isBranchAdmin: boolean;

  constructor(private localStorageService: LocalStorageService) {
    this.showSideBarMenu();
  }

  ngOnInit() {
  }

  showSideBarMenu() {
    const user = this.localStorageService.getUser().usertype;
    switch (user) {
      case UserTypes.Client:
        this.isClient = true;
        break;
      case UserTypes.GitAdmin:
        this.isGitAdmin = true;
        break;
      case UserTypes.FrontDesk:
        this.isFrontDesk = true;
        break;
      case UserTypes.CompanyAdmin:
        this.isAdmin = true;
        break;
      case UserTypes.BranchAdmin:
        this.isAdmin = true;
        break;
      case UserTypes.SuperExecutive:
        this.isExecutive = true;
        break;
      case UserTypes.BranchSuperExecutive:
        this.isExecutive = true;
        break;
      default:
        break;
    }
  }

}