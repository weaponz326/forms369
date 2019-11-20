import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-template-page',
  templateUrl: './view-template-page.component.html',
  styleUrls: ['./view-template-page.component.css']
})
export class ViewTemplatePageComponent implements OnInit {
  form: any;
  formRenderer: any;

  constructor(private router: Router) {
    this.form = window.history.state.form;
  }

  ngOnInit() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('fb-editor');
    const formRenderOpts = { formData, dataType: 'json' };
    $(this.formRenderer).formRender(formRenderOpts);
  }

  edit() {
    this.router.navigateByUrl('templates/edit/', { state: { form: this.form }});
  }

  download() {}

}
