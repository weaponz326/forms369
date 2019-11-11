import { Injectable } from '@angular/core';
import { EndpointService } from '../endpoint/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Injectable({
  providedIn: 'root'
})
export class ExecutiveService {

  headers: HttpHeaders;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Gets a list of all super executives.
   *
   * @returns {Promise<any>}
   * @memberof ExecutiveService
   */
  getSuperExecutives(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.SuperExecutive;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.users.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all branch super executives.
   *
   * @returns {Promise<any>}
   * @memberof ExecutiveService
   */
  getBranchSuperExecutives(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.BranchSuperExecutive;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.users.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
