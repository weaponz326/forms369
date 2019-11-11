import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list-branches-page',
  templateUrl: './client-list-branches-page.component.html',
  styleUrls: ['./client-list-branches-page.component.css']
})
export class ClientListBranchesPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openForm() {
    this.router.navigateByUrl('/client/form_entry/ssnit');
  }

}
