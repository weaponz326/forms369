import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  apiHost: string;
  storageHost: string;
  private localApiHost: string;
  private productionApiHost: string;

  constructor() {
    this.productionApiHost = '';
    this.localApiHost = 'http://127.0.0.1:8000/';
    this.apiHost = this.productionApiHost;
    this.storageHost = this.apiHost + 'storage/';
  }

  /**
   * Returns the appropriate headers whether uploading a file
   * or doing an normal requrest to the server.
   *
   * @param {boolean} [isUploadRequest]
   * @returns
   * @memberof EndpointService
   */
  headers(isUploadRequest?: boolean) {
    let httpHeaders: HttpHeaders;
    const token = sessionStorage.getItem('x-auth');
    if (_.isUndefined(isUploadRequest) || !isUploadRequest) {
      httpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      });
    }
    else {
      httpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      });
    }
    return httpHeaders;
  }

  /**
   * Returns the appropriate headers if the user hasnt obtained
   * a token yet, usually for api's that doesnt require the user
   * to be logged in to work.
   *
   * @returns
   * @memberof EndpointService
   */
  _headers() {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }
}
