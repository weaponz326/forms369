import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-printing-default-page',
  templateUrl: './form-printing-default-page.component.html',
  styleUrls: ['./form-printing-default-page.component.css']
})
export class FormPrintingDefaultPageComponent implements OnInit {

  form: any;
  clientData: any;

  constructor() {
    this.clientData = this.form.client_submitted_details;
  }

  ngOnInit() {
    window.onafterprint = () => {
      console.log('print window closed');
      // this.showPrintButton();
    };
  }

}
