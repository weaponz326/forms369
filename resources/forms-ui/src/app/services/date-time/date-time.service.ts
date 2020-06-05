import * as _ from 'lodash';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

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

  bootstrapDateFormat(date: string) {
    // Bootstrap date picker returns single digit for months from Jan to Sept
    // In order to allow us to compare against MYSQL which returns double digits
    // for that, we convert the month accordingly.
    const _date = date as any;
    const _day = _.toNumber(_date.day) <= 9 ? '0' + _date.day : _date.day;
    const _month = _.toNumber(_date.month) <= 9 ? '0' + _date.month : _date.month;

    const final_date = _date.year + '-' + _month + '-' + _day;
    return final_date;
  }
}
