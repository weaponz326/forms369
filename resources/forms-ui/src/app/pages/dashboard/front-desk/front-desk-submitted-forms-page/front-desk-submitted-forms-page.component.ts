import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-desk-submitted-forms-page',
  templateUrl: './front-desk-submitted-forms-page.component.html',
  styleUrls: ['./front-desk-submitted-forms-page.component.css']
})
export class FrontDeskSubmittedFormsPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openForm() {
    this.router.navigateByUrl('/front-desk/lists/submitted');
  }

}
