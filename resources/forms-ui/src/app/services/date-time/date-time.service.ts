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

  getDatePart(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Tranforms a date value into the correct format which enables the angular date pipe
   * work across all browsers
   *
   * @param {string} date
   * @returns
   * @memberof DateTimeService
   */
  safeDateFormat(date: string) {
    return date.replace(/-/g, '/');
  }
}
