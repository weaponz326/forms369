import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FrontDeskService {

  headers: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Sends rejection messages to the clients.
   *
   * @param {string} submission_code
   * @param {string} message
   * @returns {Promise<boolean>}
   * @memberof FrontDeskService
   */
  sendFormRejectionNote(submission_code: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/addReview';
      const body = { submission_code: submission_code, review: message };
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
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

  getFrontDeskAccounts(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.FrontDesk
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.FrontDesk;
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

  getForm(form_code: string, merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/FrontDeskGetSubmittedFormByCode/' + form_code + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('submitted_form: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.submitted_form[0]);
        },
        err => {
          console.log('form_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getAllFormsProcessedByDate(user_id: string, start_date: string, end_date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/FormsProcessedByFrontDeskPerson/' + user_id + '/' + start_date + '/' + end_date;
      this.http.get(url, { headers: this.headers }).subscribe(
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

  getAllFormsProcessedByUser(user_id: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllFormsProcessedByFrontDeskPerson/' + user_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.processed_forms.next_page_url;
          resolve(response.processed_forms.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getAllSubmittedFormsByMerchant(merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllSubmittedFormsByMerchant/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.submitted_forms.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getSubmittedFormByStatusAndMerchant(status: number, merchant_id: string, page_url?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getSubmittedFormByStatusAndMerchant/' + status + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.submitted_forms.next_page_url;
          response.submitted_forms.length == 0
            ? resolve(response.submitted_forms)
            : resolve(response.submitted_forms.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getProcessedFormsByFrontDesk(user_id: string, status: number, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + `api/v1/getAllFormsProcessedByFrontDeskPerson/${user_id}/${status}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.processed_forms.next_page_url;
          resolve(response.processed_forms.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Finds a form by name and status.
   *
   * @param {string} form_name
   * @param {string} merchant_id
   * @param {number} status
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  findFormByNameAndStatus(form_name: string, merchant_id: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/searchSubmittedFormByCodeorName/${status}/${merchant_id}/${form_name}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.submitted_forms);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Finds a form by code and status.
   *
   * @param {string} form_code
   * @param {string} merchant_id
   * @param {number} status
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  findFormsByCodeAndStatus(form_code: string, merchant_id: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/getSubmittedFormByFormCode/${status}/${merchant_id}/${form_code}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.submitted_forms);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns client data for all processed forms.
   *
   * @param {string} form_code
   * @param {string} [page_url]
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  getRespondantData(form_code: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/viewRespondentData/' + form_code;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          this.nextPaginationUrl = response.respondents_data.next_page_url;
          resolve(response.respondents_data.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  setFormWithClientData(form_data: Array<any>, client_data: any) {
    console.log('client: ' + client_data);
    _.forEach(form_data, (form, i) => {
      if (!_.isUndefined(form.name)) {
        const element_names =  document.getElementsByName(form.name);
        const client_keys = _.keys(client_data);
        _.forEach(client_keys, (client) => {
          if (form.name == client) {
            console.log(form.name);
            _.forEach(element_names, (element) => {
              const form_field = element as HTMLInputElement;
              // we check if the element is a radio button, checkbox or and input field
              if (form_field.getAttribute('type') == 'radio') {
                // this is a radio button.
                const radio_label = form_field.nextElementSibling.textContent;
                if (_.toLower(radio_label) == _.toLower(client_data[client])) {
                  form_field.value = client_data[client];
                  form_field.checked = true;
                }
              }
              else {
                // this is a text input.
                form_field.value = client_data[client];
              }
            });
          }
        });
      }
    });
  }

  /**
   * Returns the PDF file for a form.
   *
   * @param {string} form_code
   * @param {string} merchant_id
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  getPrintPDFFile(form_code: string, merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getPrintFile/' + merchant_id + '/' + form_code;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.file);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Processes a form by changing its status to `2`
   * which means its processed.
   *
   * @param {string} code
   * @param {*} clientData
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  completeForm(code: string, clientData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('client_dataaaaaaaa: ' + JSON.stringify(clientData));
      const url = this.endpointService.apiHost + 'api/v1/processSubmitForm/' + code + '/' + '2';
      this.http.post(url, clientData, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
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
   * Processes a form by changing its status to `1`
   * which means its in process.
   *
   * @param {string} code
   * @param {*} clientData
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  processForm(code: string, clientData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/processSubmitForm/' + code + '/' + '1';
      console.log('processForm: ' + JSON.stringify(clientData));
      this.http.post(url, clientData, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
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
   * Rejects a form by chnaging its status to `3`.
   *
   * @param {string} code
   * @param {*} clientData
   * @returns {Promise<any>}
   * @memberof FrontDeskService
   */
  rejectForm(code: string, clientData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/processSubmitForm/' + code + '/' + '3';
      this.http.post(url, clientData, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
