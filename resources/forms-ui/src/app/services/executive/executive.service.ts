import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { EndpointService } from '../endpoint/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  getSuperExecutives(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.SuperExecutive
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.SuperExecutive;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          return !_.isUndefined(allowPagination) || allowPagination
            ? resolve(response.users.data)
            : resolve(response.users);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all super executives belonging to a merchant.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof ExecutiveService
   */
  getCompanySuperExecutives(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantUsersByType/' + merchant_id + '/' + UserTypes.SuperExecutive;
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
  getBranchSuperExecutives(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.BranchSuperExecutive
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.BranchSuperExecutive;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          return !_.isUndefined(allowPagination) || allowPagination
            ? resolve(response.users.data)
            : resolve(response.users);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of branch super executibes belonging to a merchant.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof ExecutiveService
   */
  getCompanyBranchSuperExecutives(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantUsersByType/' + merchant_id + '/' + UserTypes.BranchSuperExecutive;
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
