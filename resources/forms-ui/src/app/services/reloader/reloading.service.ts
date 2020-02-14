import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadingService {

  constructor() { }

  /**
   * This is just a little hack to prevent loss of data passed in to window.history.state
   * whenever the page is reloaded. The purpose is to ensure we still have the data needed
   * to help build all the elements of this page.
   *
   * @version 0.0.2
   * @memberof EditFormPageComponent
   */
  resolveReloadDataLoss(view_data: any) {
    if (!_.isUndefined(view_data)) {
      sessionStorage.setItem('u_form', JSON.stringify(view_data));
      return JSON.parse(sessionStorage.getItem('u_form'));
    }
    else {
      return JSON.parse(sessionStorage.getItem('u_form'));
    }
  }
}
