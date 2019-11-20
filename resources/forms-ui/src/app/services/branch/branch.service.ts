import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { CompanyBranches } from 'src/app/models/company-branches.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  headers: HttpHeaders;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Creates a new branch.
   *
   * @param {CompanyBranches} branch
   * @returns {Promise<any>}
   * @memberof BranchService
   */
  createBranch(branch: CompanyBranches): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/createCompanyBranch';
      this.http.post(url, JSON.stringify(branch), { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Edits a branch.
   *
   * @param {string} id
   * @param {CompanyBranches} branch
   * @returns {Promise<any>}
   * @memberof BranchService
   */
  editBranch(id: string, branch: CompanyBranches): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/editCompanyBranch/' + id;
      this.http.post(url, JSON.stringify(branch), { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a details of company branch.
   *
   * @param {string} id
   * @returns {Promise<CompanyBranches>}
   * @memberof BranchService
   */
  getBranch(id: string): Promise<CompanyBranches> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getCompanyBranches/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.branches.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns details of a branch.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof BranchService
   */
  getBranchDetails(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getCompanyBranchDetails/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          resolve(res as CompanyBranches);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all branches.
   *
   * @returns {Promise<Array<CompanyBranches>>}
   * @memberof BranchService
   */
  getAllBranches(): Promise<Array<CompanyBranches>> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllBranches';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.branches.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all admins assigned to the specified branch.
   *
   * @returns {Promise<any>}
   * @memberof BranchService
   */
  getAllBranchAdmins(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.BranchAdmin;
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

  enableBranch(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/enableBranch/' + id;
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

  disableBranch(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/disableBranch/' + id;
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
   * Deletes a branch.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof BranchService
   */
  deleteBranch(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }
}
