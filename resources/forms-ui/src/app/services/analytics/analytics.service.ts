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
   * Gets the total number of users or user accounts.
   *
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getAllUsersCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllUsers';
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
   * Gets the total number of users or user accounts
   * existing in a specified company.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getCompanyUsersCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllUsersByMerchant/' + merchant_id;
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
   * Gerts the total number of users or user accounts
   * belogning to a specifiec merchant branch.
   *
   * @param {string} branch_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getBranchUsersCount(branch_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllUsersByBranch/' + branch_id;
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
      const url = this.endpointService.apiHost + 'api/v1/getNumAllFormsByMerchant/' + merchant_id;
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

  /**
   * Gets the total number of forms submitted.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
  getFrontDeskSubmittedFormsCount(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumSubmittedFormsByStatus/0/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('forms: ' + response.num_forms);
          resolve(response.num_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets the total number of forms in-process.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
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

  /**
   * Gets the total number of forms processed.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof AnalyticsService
   */
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

  getRejectedFormsByFrontDeskCount(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllFormsProcessedByFrontDeskPerson/' + user_id + '/3';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('res: ' + JSON.stringify(response));
          resolve(response.num_processed_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getProcessedFormsByFrontDeskCount(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllFormsProcessedByFrontDeskPerson/' + user_id + '/2';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.num_processed_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getProcessingFormsByFrontDeskCount(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllFormsProcessedByFrontDeskPerson/' + user_id + '/1';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.num_processed_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getClientSubmittedForms(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getNumAllsubmittedForms/' + user_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.num_processed_forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getClientFormsCount(user_id: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/getNumClientFormsByStatus/${user_id}/${status}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms: ' + JSON.stringify(res));
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
