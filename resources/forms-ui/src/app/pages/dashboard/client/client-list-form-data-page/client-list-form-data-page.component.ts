import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-list-form-data-page',
  templateUrl: './client-list-form-data-page.component.html',
  styleUrls: ['./client-list-form-data-page.component.css']
})
export class ClientListFormDataPageComponent implements OnInit {

  hasData: boolean;
  loading: boolean;
  hasError: boolean;
  isConnected: boolean;

  constructor() { }

  ngOnInit() {
  }

}
