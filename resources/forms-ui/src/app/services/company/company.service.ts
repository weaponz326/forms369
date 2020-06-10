import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { Merchants } from 'src/app/models/merchants.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { FileUploadsService } from '../file-uploads/file-uploads.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private headers: HttpHeaders;
  private fileHeaders: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService, private fileUploader: FileUploadsService) {
    this.headers = this.endpointService.headers();
    this.fileHeaders = this.endpointService.headers(true);
  }

  /**
   * Creates a new company.
   *
   * @param {Merchants} merchant
   * @param {File} logo
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  createCompany(merchant: Merchants, logo: File): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('merchant: ' + JSON.stringify(merchant));
      const url = this.endpointService.apiHost + 'api/v1/createMerchant';

      const form = new FormData();
      form.set('logo', logo);
      form.set('colors', merchant.colors);
      form.set('country', merchant.country);
      form.set('nickname', merchant.nickname);
      form.set('can_print', merchant.can_print);
      form.set('small_logo', merchant.small_logo);
      form.set('merchant_name', merchant.merchant_name);
      form.set('super_id', merchant.super_id.toString());
      form.set('admin_id', merchant.admin_id.toString());
      form.set('sector_id', merchant.sector_id.toString());
      form.set('physical_address', merchant.physical_address);

      this.http.post(url, form, { headers: this.fileHeaders }).subscribe(
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
   * Sends a PUT request to the server to change company details.
   *
   * @private
   * @param {string} url
   * @param {FormData} form
   * @returns {Promise<boolean>}
   * @memberof CompanyService
   */
  private updateCompany(url: string, form: FormData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post(url, form, { headers: this.fileHeaders }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
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

  /**
   * Updates a specified company's details.
   *
   * @param {number} id
   * @param {Merchants} merchant
   * @param {File} [logo]
   * @returns {Promise<boolean>}
   * @memberof CompanyService
   */
  editCompany(id: number, merchant: Merchants, logo?: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('merchant: ' + JSON.stringify(merchant));
      const url = this.endpointService.apiHost + 'api/v1/editMerchant/' + id;

      if (!_.isUndefined(logo)) {
        this.fileUploader.uploadCompanyLogo(logo).then(
          filename => {
            const form = new FormData();
            form.set('logo', filename);
            form.set('country', merchant.country);
            form.set('can_print', merchant.can_print);
            form.set('status', merchant.status.toString());
            form.set('merchant_name', merchant.merchant_name);
            form.set('super_id', merchant.super_id.toString());
            form.set('admin_id', merchant.admin_id.toString());

            this.updateCompany(url, form).then(
              ok => {
                console.log('response: ' + JSON.stringify(ok));
                resolve(ok);
              },
              err => {
                console.log('error: ' + JSON.stringify(err));
                reject(err);
              }
            );
          }
        );
      }
      else {
        const form = new FormData();
        form.set('logo', merchant.logo);
        form.set('country', merchant.country);
        form.set('can_print', merchant.can_print);
        form.set('status', merchant.status.toString());
        form.set('merchant_name', merchant.merchant_name);
        form.set('super_id', merchant.super_id.toString());
        form.set('admin_id', merchant.admin_id.toString());

        this.updateCompany(url, form).then(
          ok => {
            console.log('response: ' + JSON.stringify(ok));
            resolve(ok);
          },
          err => {
            console.log('error: ' + JSON.stringify(err));
            reject(err);
          }
        );
      }
    });
  }

  /**
   * Returns all information about a company.
   *
   * @param {number} id
   * @returns {Promise<Merchants>}
   * @memberof CompanyService
   */
  getCompany(id: number): Promise<Merchants> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantDetails/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response_merchant: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.merchant);
        },
        err => {
          console.log('error_merchants: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of companies by filtering based on country.
   *
   * @param {string} country
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  getCompanyByCountry(country: string, sector_id: number, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllMerchantsByCountry/' + country + '/' + sector_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response_merchant: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.merchant.next_page_url;
          resolve(response.merchant.data);
        },
        err => {
          console.log('error_merchants: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a company or list of companies based on the name provided.
   *
   * @param {string} company_name
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  getCompanyByName(company_name: string, country: string, sector_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantbyName/' + company_name + '/' + country + '/' + sector_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response_c_names: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.merchants);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all companies. This returns the list
   * in a a paginated order of 15 companies per request.
   *
   * @param {string} [page_url]
   * @returns {Promise<Array<Merchants>>}
   * @memberof CompanyService
   */
  getAllCompanies(page_url?: string): Promise<Array<Merchants>> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllMerchants';

      console.log('url: ' + url);
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('all_merchants: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.merchants.next_page_url;
          resolve(response.merchants.data);
        },
        err => {
          console.log('error_merchants: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a collection of all merchants without pagination.
   *
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  getAllCompanyCollection(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantsForDropdown';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('all_merchants: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.merchants);
        },
        err => {
          console.log('error_merchants: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all admins assigned to all company.
   *
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  getAllCompanyAdmins(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.CompanyAdmin
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.CompanyAdmin;
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
   * Gets a list of all company admins assigned to a specified.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  getCompanyAdmins(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantUsersByType/' + merchant_id + '/' + UserTypes.CompanyAdmin;
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
   * Searches for a form based on the name of the form.
   *
   * @param {string} form_name
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  findFormsByName(form_name: string, merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormbyNameAndMerchant/' + form_name + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms_by_name: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.form);
        },
        err => {
          console.log('f_by_name_erro: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Searches for a form based on the name and status of the form.
   *
   * @param {string} form_name
   * @param {string} merchant_id
   * @param {number} status
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  findFormsByNameAndStatus(form_name: string, merchant_id: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/getFormbyNameStatusAndMerchant/${form_name}/${status}/${merchant_id}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms_by_name: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.form);
        },
        err => {
          console.log('f_by_name_erro: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Searches for a user belonging to a company/merchant.
   *
   * @param {number} user_type
   * @param {string} merchant_id
   * @param {string} search_query
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  findUser(user_type: number, merchant_id: string, search_query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/getUserByTypeAndMerchant/${user_type}/${merchant_id}/${search_query}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms_by_name: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.users);
        },
        err => {
          console.log('f_by_name_erro: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Searches for a user belonging to a company/merchant based on the user info and status.
   *
   * @param {number} user_type
   * @param {string} merchant_id
   * @param {number} status
   * @param {string} search_query
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  findUserByStatusAndName(user_type: number, merchant_id: string, status: number, search_query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/getUserByTypeStatusAndMerchant/${user_type}/${merchant_id}/${status}/${search_query}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms_by_name: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.users);
        },
        err => {
          console.log('f_by_name_erro: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Changes a company's status to `active`.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof CompanyService
   */
  enableCompany(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/enableMerchant/' + id;
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
   * Changes a company's status to `inactive`.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof CompanyService
   */
  disableCompany(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/disableMerchant/' + id;
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
   * Deletes a company.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof CompanyService
   */
  deleteCompany(id: string): Promise<any> {
    return new Promise((Resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/' + id;
      this.http.post(url, {}, { headers: this.endpointService.headers() }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}