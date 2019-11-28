import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Gets the total number of users or user accounts
   * existing in a specified company.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getCompanyUsersCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('users: ' + res);
          const response = res as any;
          resolve(response.num_users);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of companies.
   *
   * @returns {Promise<string>}
   * @memberof AnalyticsService
   */
  getCompanyCount(): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumMerchants';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('merchants: ' + res);
          const response = res as any;
          resolve(response.num_merchants);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of active companies.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getActiveCompanyCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumActiveMerchants';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('merchant: ' + res);
          const response = res as any;
          resolve(response.num_active_merchants);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of inactive companies.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getInactiveCompanyCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumInactiveMerchants';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('inactive' + res);
          const response = res as any;
          resolve(response.num_inactive_merchants);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of branches.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getBranchCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumBranches';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('branches' + res);
          const response = res as any;
          resolve(response.num_branches);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of active branches.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getActiveBranchCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumActiveBranches';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('branches' + res);
          const response = res as any;
          resolve(response.num_active_branches);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of inactive branches.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getInactiveBranchCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumInactiveBranches';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('branches' + res);
          const response = res as any;
          resolve(response.num_inactive_branches);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of branches in a specified company.
   *
   * @param {string} company_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getCompanyBranchCount(company_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumCompanyBranches/' + company_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('branches' + res);
          const response = res as any;
          resolve(response.num_branches);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of froms available.
   *
   * @returns {Promise<string>}
   * @memberof AnalyticsService
   */
  getAllFormsCount(): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllForms';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms' + res);
          const response = res as any;
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of forms created by a merchant.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getCompanyFormCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllFormsByMerchant' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + res);
          const response = res as any;
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getFrontDeskSubmittedFormsCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumSubmittedFormsByStatus/0/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + res);
          const response = res as any;
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getFrontDeskProcessingFormsCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumSubmittedFormsByStatus/1/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + res);
          const response = res as any;
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getFrontDeskProcessedFormsCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumSubmittedFormsByStatus/2/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + res);
          const response = res as any;
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
