import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  apiHost: string;
  qmsApiHost: string;
  storageHost: string;
  clientID: number;
  clientSecret: string;
  private localApiHost: string;
  private productionApiHost: string;

  constructor() {
    this.productionApiHost = '';
    this.qmsApiHost = 'https://qms.gitlog.biz/';
    this.localApiHost = 'http://127.0.0.1:8000/';
    this.apiHost = window.origin == 'http://localhost:4200' ? this.localApiHost : this.productionApiHost;
    this.storageHost = window.origin == 'http://localhost:4200' ? this.apiHost + 'storage/' : this.productionApiHost + 'storage/';
    this.clientID = window.origin == 'http://localhost:4200' ? 14 : 6;
    this.clientSecret = window.origin == 'http://localhost:4200'
      ? 'CFoa1NgOO9uMq73mE1Mc2Uy0svMTDDgcPygHriYX'
      : 'RbnbY9yO5CVrDrDb33J6pUmlq661PuKhZaByTtIt';
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
    const token = sessionStorage.getItem('x-auth');
    if (_.isUndefined(isUploadRequest) || !isUploadRequest) {
      const httpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      });

      return httpHeaders;
    }
    else {
      const httpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      });

      return httpHeaders;
    }
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

  /**
   * Set cheader with a specified token.
   * @param token Token to set.
   */
  setHeaders(token: string) {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    });
  }
}
