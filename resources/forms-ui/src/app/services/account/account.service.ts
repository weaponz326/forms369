import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Users } from 'src/app/models/users.model';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private headers: HttpHeaders;
  private authHeaders: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService._headers();
    this.authHeaders = this.endpointService.headers();
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
   * Grants or denies a user access to the login page.
   *
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  checkLoginAccess(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/checkAccess';
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ', JSON.stringify(res));
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
   * Verifies an access code.
   *
   * @param {string} access_code
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  verifyAccessCode(access_code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/ValidateAccessCode/' + access_code;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
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
   * Updates a user's password.
   *
   * @param {string} user_id
   * @param {string} old_password
   * @param {string} new_password
   * @param {string} confirmation_password
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  updateAccountPassword(user_id: string, old_password: string, new_password: string, confirmation_password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/changePassword/' + user_id;
      const body = {
        current_password: old_password,
        new_password: new_password,
        new_password_confirmation: confirmation_password
      };

      this.http.post(url, body, { headers: this.authHeaders }).subscribe(
        res => {
          const response = res as any;
          console.log('updated_password: ' + JSON.stringify(response));
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(response.message);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Creates a new access code for all users other than `clients`.
   *
   * @param {*} access_code_data
   * @returns {Promise<string>}
   * @memberof AccountService
   */
  createAccessCode(access_code_data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(access_code_data);
      const headers = this.endpointService.headers();
      const url = this.endpointService.apiHost + 'api/v1/createAccessCode';
      this.http.post(url, body, { headers: headers }).subscribe(
        res => {
          console.log('access code created: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.code);
        },
        err => {
          console.log('access code error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all country codes. The country codes
   * are a JSOn file stored locally in the assets directory.
   *
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  getCountryDialCodes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/countries_dial_codes.json').subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets and returns all existing access codes.
   *
   * @param {string} [page_url]
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  getAllAccessCodes(page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = this.endpointService.headers();
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllCodes';
      this.http.get(url, { headers: headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.codes.next_page_url;
          resolve(response.codes.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of access codes based on their status.
   *
   * @param {string} status
   * @param {string} [page_url]
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  getAllAccessCodeByStatus(status: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = this.endpointService.headers();
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAccessCodesByStatus/' + status;
      this.http.get(url, { headers: headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.merchants.next_page_url;
          resolve(response.codes.data);
        },
        err => {
          console.log('access code error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Re-activates an access code.
   *
   * @param {string} access_code
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  activateAccessCode(access_code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/activateAccessCode/' + access_code;
      this.http.post(url, {}, { headers: this.authHeaders }).subscribe(
        res => {
          console.log('res____: ' + JSON.stringify(res));
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.log('err_____: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Deactivates an access code.
   *
   * @param {string} access_code
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  deActivateAccessCode(access_code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deactivateAccessCode/' + access_code;
      this.http.post(url, {}, { headers: this.authHeaders }).subscribe(
        res => {
          console.log('res______: ' + JSON.stringify(res));
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.log('err_____: ' + JSON.stringify(err));
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
      case UserTypes.GitAdmin:
        return 'GIt Admin';
      default:
        break;
    }
  }

  /**
   * Gets all users belonging to a specified merchant.
   *
   * @param {string} merchant_id
   * @param {string} [pagination_url]
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  getAllUsersByMerchant(merchant_id: string, pagination_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(pagination_url)
        ? pagination_url
        : this.endpointService.apiHost + 'api/v1/getAllUsersByMerchant/' + merchant_id;
      this.http.get(url, { headers: this.endpointService.headers() }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.users.next_page_url;
          resolve(response.users.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
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
   * Updates a user's (NOT CLIENT USER) account password.
   *
   * @param {string} user_id
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof AccountService
   */
  changeAccountPassword(user_id: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        new_password: password,
        new_password_confirmation: password
      };
      const url = this.endpointService.apiHost + 'api/resetPassword/' + user_id;
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
   * Verifies a user's email address to enable the user
   * reset his/her accounts password.
   *
   * @param {string} email
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  verifyAccountForResetting(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = { email: email };
      const url = this.endpointService.apiHost + 'api/forgotPassword';
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('res_: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('err_: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  verifyAccountForPinReset(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = { email: email };
      const url = this.endpointService.apiHost + 'api/v1/forgotPin';
      this.http.post(url, JSON.stringify(body), { headers: this.endpointService.headers() }).subscribe(
        res => {
          console.log('res_: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(response.message);
        },
        err => {
          console.log('err_: ' + JSON.stringify(err));
          reject(err);
        }
      )
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
      const url = this.endpointService.apiHost + 'api/logoutUser';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          sessionStorage.clear();
          resolve(res);
        },
        err => {
          sessionStorage.clear();
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a user's account.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof AccountService
   */
  deleteAccount(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const header = this.endpointService.headers();
      const url = this.endpointService.apiHost + 'api/v1/deleteUser/' + id;
      this.http.post(url, {}, { headers: header }).subscribe(
        res => {
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
