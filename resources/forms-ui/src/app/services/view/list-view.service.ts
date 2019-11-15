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
    return _.isNull(mode) ? 'grid' : mode;
  }

  setDesiredViewMode(mode: string) {
   localStorage.setItem('view_mode', mode);
  }
}
