import { Injectable } from '@angular/core';
import { Forms } from 'src/app/models/forms.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  headers: HttpHeaders;

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
  getAllForms(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllForms';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
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
  getAllFormsByStatus(status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllFormsByStatus/' + status;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
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
  getAllFormsByMerchant(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllFormsByMerchant/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
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
  getAllFormsByStatusAndMerchant(merchant_id: string, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllFormsByStatusAndMerchant/' + status + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
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
  changeFormStatus(code: string, status: string): Promise<any> {
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

  /**
   * Generates an alphanumeric string which is 6 in length.
   * NOTE: This generated code must include a number.
   *
   * @returns {string}
   * @memberof FormBuilderService
   */
  generateUniqueFormCode(): string {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    if (/\d/.test(code)) {
      return code;
    }
    else {
      this.generateUniqueFormCode();
    }
  }

  deleteForm(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deleteForm/' + id;
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
}
