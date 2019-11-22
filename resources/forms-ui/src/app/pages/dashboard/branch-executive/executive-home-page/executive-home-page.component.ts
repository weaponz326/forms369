import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-executive-home-page',
  templateUrl: './executive-home-page.component.html',
  styleUrls: ['./executive-home-page.component.css']
})
export class ExecutiveHomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openProcessedForms() {
    this.router.navigateByUrl('/executive/processed');
  }

  openFormsInProcessing() {
    this.router.navigateByUrl('/executive/processing');
  }

  openSubmittedForms() {
    this.router.navigateByUrl('/executive/submitted');
  }

}
