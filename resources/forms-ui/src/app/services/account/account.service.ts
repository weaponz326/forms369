import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { UserTypes } from 'src/app/enums/user-types.enum';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService._headers();
  }

  /**
   * Logs in a user.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  authenticate(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/login';
      const body = { username: username, password: password };
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Creates a new user account.
   *
   * @param {Users} user
   * @returns {Promise<Users>}
   * @memberof AccountService
   */
  createAccount(user: Users): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/registerUser';
      console.log(JSON.stringify(user));
      this.http.post(url, JSON.stringify(user), { headers: this.headers }).subscribe(
        res => {
          console.log('ress: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets details of a user account.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  getAccount(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('id: ' + id);
      const url = this.endpointService.apiHost + 'api/v1/getUser/' + id;
      this.http.get(url, { headers: this.endpointService.headers() }).subscribe(
        res => {
          console.log('Account_details: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.user[0]);
        },
        err => {
          console.log('account_details_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the `type` of user based on a user type `id`.
   *
   * @param {string} user_type_id
   * @returns
   * @memberof AccountService
   */
  getAccountType(user_type_id: string) {
    switch (Number(user_type_id)) {
      case UserTypes.BranchAdmin:
        return 'Branch Admin';
      case UserTypes.BranchSuperExecutive:
        return 'Branch Super Executive';
      case UserTypes.CompanyAdmin:
        return 'Company Admin';
      case UserTypes.FrontDesk:
        return 'Front Desk';
      case UserTypes.SuperExecutive:
        return 'Super Executive';
      default:
        break;
    }
  }

  /**
   * Edits a user's account.
   *
   * @param {string} id
   * @param {Users} user
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  editAccount(id: string, user: Users): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/editUser/' + id;
      console.log('user_edit: ' + JSON.stringify(user));
      this.http.post(url, JSON.stringify(user), { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          console.log('response_edit: ' + JSON.stringify(res));
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else  {
            resolve(false);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Activates an inactive/disabled user account.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  enableAccount(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/enableUser/' + id;
      this.http.post(url, {}, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Disables a user's account.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  disableAccount(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/disableUser/' + id;
      this.http.post(url, {}, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Logs a user out.
   *
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/logoutUser';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
