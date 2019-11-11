import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-form-lists-page',
  templateUrl: './admin-form-lists-page.component.html',
  styleUrls: ['./admin-form-lists-page.component.css']
})
export class AdminFormListsPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  edit() {
    this.router.navigateByUrl('/admin/edit_form');
  }

  view() {
    this.router.navigateByUrl('/admin/view_form');
  }

  delete() {}

}
