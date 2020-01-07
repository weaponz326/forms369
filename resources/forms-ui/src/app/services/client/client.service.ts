import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Send a two-way authenticate code to the clients phone.
   *
   * @param {string} id
   * @param {string} phone
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  sendAuthCode(id: string, phone: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const header = this.endpointService._headers();
      const url = this.endpointService.apiHost + `api/sendTwoWayAuthenticationCode/${id}/${phone}`;
      this.http.post(url, {}, { headers: header }).subscribe(
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
   * Verifies a two-way auth code.
   *
   * @param {string} id
   * @param {string} code
   * @param {string} phone
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  verifyAuthCode(id: string, code: string, phone: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const header = this.endpointService._headers();
      const url = this.endpointService.apiHost + `api/twoWayAuthenticationVerification/${id}/${code}/${phone}`;
      this.http.post(url, {}, { headers: header }).subscribe(
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

  submitForm(id: string, code: string, client_data: any, form_data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = { client_profile: client_data, form_data: form_data };
      console.log('Body: ' + JSON.stringify(body));
      const url = this.endpointService.apiHost + 'api/v1/submitForm/' + id + '/' + code;
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('form_submitted: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('f_submit_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  editProfile(id: string, profile: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(profile);
      const url = this.endpointService.apiHost + 'api/v1/editClientProfile/' + id;
      this.http.post(url, body, { headers: this.headers }).subscribe(
        res => {
          resolve(res);
        },
        err => {
          console.log('Error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getDetails(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientsDetails/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          resolve(response.client[0]);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getAllClients(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllClients';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          resolve(response.users);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getAllSubmittedForms(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientSubmittedForms/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('submitted forms: ' + JSON.stringify(response.forms.data));
          resolve(response.forms.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getFormByStatus(id: string, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientFormsByStatus/' + id + '/' + status;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          resolve(response.forms);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Auto fills any form with the users already existing data.
   * NOTE: This is the most critical method of the application and should
   * always remain bug free.
   *
   * @param {Array<any>} form_data
   * @param {Array<any>} client_data
   * @memberof ClientService
   */
  autoFillFormData(form_data: Array<any>, client_data: Array<any>) {
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
              else if (form_field.getAttribute('type') == 'checkbox') {
                // this is a checkbox.
                const checkbox_label = form_field.nextElementSibling.textContent;
                if (_.toLower(checkbox_label) == _.toLower(client_data[client])) {
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

  fillClientProfileData(form_sections: Array<any>, client_data: Array<any>) {
    _.forEach(form_sections, (section) => {
      console.log('**se: ' + section.heading);
      _.forEach(section.form_fields, (form) => {
        if (!_.isUndefined(form.name)) {
          const element_names = document.getElementsByName(form.name);
          const client_keys = _.keys(client_data);
          _.forEach(client_keys, (client) => {
            if (form.name == client) {
              _.forEach(element_names, (element) => {
                const form_field = element as HTMLInputElement;
                // we check if the element is a radio button, checkbox or and input field
                if (form_field.type == 'radio') {
                  // this is a radio button.
                  _.forEach(form.values, (value) => {
                    const radio_label = form_field.nextSibling.textContent;
                    if (_.toLower(radio_label) == _.toLower(client_data[client])) {
                      form_field.value = client_data[client];
                      form_field.checked = true;
                    }
                  });
                }
                else if (form_field.type == 'checkbox') {
                  // this is a checkbox.
                  const checkbox_label = form_field.nextSibling.textContent;
                  console.log('check_lbl: ' + checkbox_label);
                  console.log('value: ' + client_data[client]);
                  _.forEach(form.values, (value) => {
                    if (_.toLower(checkbox_label) == _.toLower(client_data[client])) {
                      form_field.value = client_data[client];
                      form_field.checked = true;
                    }
                  });
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
    });
  }

  getUpdatedClientFormData(new_form_data: any, existing_client_data: any) {
    const obj = _.toPlainObject(new_form_data);
    const keys = _.keys(obj);
    console.log('client_k: ' + _.keys(existing_client_data)[0]);
    _.forEach(keys, (key, i) => {
      existing_client_data[key] = obj[key];
    });

    return JSON.stringify(existing_client_data);
  }

  /**
   * Searches for a form by code.
   *
   * @param {string} form_code
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  findFormsByCode(form_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormDetails/' + form_code;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('forms_by_code: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.form);
          resolve(res);
        },
        err => {
          console.log('f_by_code_erro: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Searchs for a form by the name.
   *
   * @param {string} form_name
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  findFormsByName(form_name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormbyName/' + form_name;
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

  validateFormFilled(form_data: Array<any>) {
    const toFillFormFields: any[] = [];
    _.forEach(form_data, (data) => {
      // we are only checking form fields with the required attribute associated with them
      if (!_.isUndefined(data.required)) {
        // if the userData array is empty we return this cueernt form field object
        console.log('userData: ' + data.userData);
        if (data.userData == '') {
          toFillFormFields.push(data);
        }
      }
    });

    return toFillFormFields;
  }

  /**
   * Highlights all input fields that are required but 
   * have not been filled by the user.
   * @param {Array<any>} form_data 
   */
  highlightUnFilledFormFields(form_data: Array<any>) {
    document.querySelectorAll('input').forEach((input) => {
      input.style.borderColor = '#acacac';
    });
    if (form_data.length != 0) {
      _.forEach(form_data, (field) => {
        document.getElementById(field.name).style.borderColor = '#e2898d';
      });
    }
  }

  uploadFormAttachments(client_id: string, form_code: string, submission_code: string, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/uploadattachments/${client_id}/${form_code}/${submission_code}`;
      const form = new FormData();
      form.set('file', file);

      this.http.post(url, form, { headers: this.endpointService.headers(true) }).subscribe(
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

  getFormAttachment(submission_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'getAttachments/' + submission_code;
      this.http.get(url, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          resolve(response.attachments);
        },
        err => {
          reject(err);
        }
      )
    });
  }
}
