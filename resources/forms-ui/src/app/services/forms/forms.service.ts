import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Forms } from 'src/app/models/forms.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  private headers: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Create a new form.
   *
   * @param {Forms} form
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  createForm(form: Forms): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('body: ' + JSON.stringify(form));
      const url = this.endpointService.apiHost + 'api/v1/createForm';
      this.http.post(url, JSON.stringify(form), { headers: this.headers }).subscribe(
        res => {
          console.log('create_forms: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('forms_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a form.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  getForm(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormDetails/' + id;
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

  /**
   * Returns a list of all created forms.
   *
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  getAllForms(page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllForms';

      console.log('url: ' + url);
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all created forms based on the forms status.
   *
   * @param {string} status
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  getAllFormsByStatus(status: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllFormsByStatus/' + status;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets all forms from a specified merchant/company.
   *
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  getAllFormsByMerchant(merchant_id: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllFormsByMerchant/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all created forms based on the forms status
   * from a specified merchant/company.
   *
   * @param {string} merchant_id
   * @param {string} status
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  getAllFormsByStatusAndMerchant(merchant_id: string, status: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllFormsByStatusAndMerchant/' + status + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Changes the status of a form.
   *
   * @param {string} code
   * @param {string} status
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  changeFormStatus(code: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/changeFormStatus/' + code + '/' + status;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('edit_status: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('edit_status_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Edits a form.
   *
   * @param {string} code
   * @param {Forms} form
   * @returns {Promise<any>}
   * @memberof FormBuilderService
   */
  editForm(code: string, form: Forms): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(form);
      const url = this.endpointService.apiHost + 'api/v1/editForm/' + code;
      this.http.post(url, body, { headers: this.headers }).subscribe(
        res => {
          console.log('edit_forms: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('edit_forms_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  deleteForm(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deleteForm/' + id;
      console.log(url);
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('del_forms: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('del_forms_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  recoverForm(id: string) {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/recoverForm/' + id;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('edit_forms: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('edit_forms_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  uploadFormPDF(merchant_id: string, form_code: string, pdf: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      const fileHeader = this.endpointService.headers(true);
      const url = this.endpointService.apiHost + 'api/v1/uploadPrintFile/' + merchant_id + '/' + form_code;

      form.set('file', pdf);
      this.http.post(url, form, { headers: fileHeader }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  editFormPDF(merchant_id: string, form_code: string, pdf: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      const fileHeader = this.endpointService.headers(true);
      const url = this.endpointService.apiHost + 'api/v1/editPrintFile/' + merchant_id + '/' + form_code;

      form.set('file', pdf);
      this.http.post(url, form, { headers: fileHeader }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
