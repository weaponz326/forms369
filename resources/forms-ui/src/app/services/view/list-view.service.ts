import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListViewService {

  constructor() { }

  getDesiredViewMode() {
    const mode = localStorage.getItem('view_mode');
    console.log('mode: ' + mode);
    return this.isTabletDevice() ? 'list' : _.isNull(mode) ? 'grid' : mode;
  }

  getSortOrder() {
    const order = localStorage.getItem('sort_order');
    return _.isNull(order) ? 'desc' : order;
  }

  setDesiredViewMode(mode: string) {
   localStorage.setItem('view_mode', mode);
  }

  setSortOrder(order: string) {
    localStorage.setItem('sort_order', order);
  }

  isTabletDevice() {
    const isTablet = window.matchMedia('only screen and (min-width: 768px) and (max-width: 1024px)');
    return isTablet.matches ? true : false;
  }
}
