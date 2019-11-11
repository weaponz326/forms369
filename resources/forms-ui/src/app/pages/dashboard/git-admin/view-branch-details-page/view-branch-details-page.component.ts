import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-branch-details-page',
  templateUrl: './view-branch-details-page.component.html',
  styleUrls: ['./view-branch-details-page.component.css']
})
export class ViewBranchDetailsPageComponent implements OnInit {

  id: string;
  company: any;
  loading: boolean;
  _loading: boolean;
  isActive: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggleStatus() {}

  edit(id: string) {}

}
