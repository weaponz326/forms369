import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  transformHeaders(headers: string[]) {
    const allHeaders: string[] = [];
    _.forEach(headers, (header) => {
      allHeaders.push(_.startCase(header));
    });

    return allHeaders;
  }
}
