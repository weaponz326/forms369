import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Component({
  selector: 'app-view-template-page',
  templateUrl: './view-template-page.component.html',
  styleUrls: ['./view-template-page.component.css']
})
export class ViewTemplatePageComponent implements OnInit {
  form: any;
  formRenderer: any;
  isGitAdmin: boolean;

  constructor(private router: Router, private localStorage: LocalStorageService) {
    this.form = window.history.state.form;
    this.resolveReloadDataLoss();
    const user = this.localStorage.getUser().usertype;
    this.isGitAdmin = user == UserTypes.GitAdmin ? true : false;
  }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss() {
    if (!_.isUndefined(this.form)) {
      console.log('is undefined oooooooooooo');
      sessionStorage.setItem('u_form', JSON.stringify(this.form));
    }
    else {
      this.form = JSON.parse(sessionStorage.getItem('u_form'));
    }
  }

  ngOnInit() {
    const formData = this.form.form_fields;
    this.formRenderer = document.getElementById('fb-editor');
    const formRenderOpts = { formData, dataType: 'json' };
    $(this.formRenderer).formRender(formRenderOpts);
  }

  // edit() {
  //   this.router.navigateByUrl('templates/edit', { state: { form: this.form }});
  // }

  import() {
    this.router.navigateByUrl('admin/create/form', { state: { template: this.form }});
  }

  download() {}

}
