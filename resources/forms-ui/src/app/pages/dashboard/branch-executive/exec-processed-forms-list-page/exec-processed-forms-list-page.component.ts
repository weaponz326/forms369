import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exec-processed-forms-list-page',
  templateUrl: './exec-processed-forms-list-page.component.html',
  styleUrls: ['./exec-processed-forms-list-page.component.css']
})
export class ExecProcessedFormsListPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.route.snapshot.params.type);
  }

}
