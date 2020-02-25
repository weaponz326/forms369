import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Gets a lists of all GIT Admin accounts.
   *
   * @param {boolean} [allowPagination]
   * @returns {Promise<any>}
   * @memberof AdminService
   */
  getGitAdmins(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.GitAdmin
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.GitAdmin;
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
   * Returns a collection of all user accounts belonging to a merchant.
   *
   * @param {number} user_type
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AdminService
   */
  getAllUsersByMerchant(user_type: number, merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantUsersByType/' + merchant_id + '/' + user_type;
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
   * Returns a collection of all user accounts belonging to a branch.
   *
   * @param {number} user_type
   * @param {string} branch_id
   * @returns {Promise<any>}
   * @memberof AdminService
   */
  getAllUsersByBranch(user_type: number, branch_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getBranchUsersByType/' + branch_id + '/' + user_type;
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
   * Grants or denies download permission to an account.
   *
   * @param {string} account_id
   * @param {(1 | 0)} status
   * @returns {Promise<boolean>}
   * @memberof AdminService
   */
  setupCanDownloadPermission(account_id: string, status: 1 | 0): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('acc_id: ' + account_id);
      const url = this.endpointService.apiHost + 'api/v1/candownload/' + account_id + '/' + status;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
