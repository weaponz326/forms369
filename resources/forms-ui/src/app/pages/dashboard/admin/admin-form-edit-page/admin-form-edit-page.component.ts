import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-admin-form-edit-page',
  templateUrl: './admin-form-edit-page.component.html',
  styleUrls: ['./admin-form-edit-page.component.css']
})
export class AdminFormEditPageComponent implements OnInit {

  formBuilder: any;

  constructor() { }

  ngOnInit() {
    this.formBuilder = $(document.getElementById('fb-editor')).formBuilder({
      controlPosition: 'left',
      scrollToFieldOnAdd: false,
      disabledActionButtons: ['data', 'clear', 'save'],
    });
  }

  save() {
    console.log(this.formBuilder.actions.getData());
  }

}
