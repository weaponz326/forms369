import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  /**
   * Returns todays date, (Date only or date with time).
   *
   * @param {boolean} [withTime]
   * @returns
   * @memberof DateTimeService
   */
  getToday(withTime?: boolean) {
    if (_.isUndefined(withTime) || !withTime) {
      return moment().format('DD-MM-YYYY');
    }
    else {
      return moment().format('MM-DD-YYYY hh:mm:ss');
    }
  }

  // convertToMilliseconds(date1: string, date2: string): number {
    
  // }
}
