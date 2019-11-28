import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exec-processed-forms-page',
  templateUrl: './exec-processed-forms-page.component.html',
  styleUrls: ['./exec-processed-forms-page.component.css']
})
export class ExecProcessedFormsPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openForm() {
    this.router.navigateByUrl('/executive/processed_list/passport');
  }

}
