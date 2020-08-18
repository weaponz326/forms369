import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  headers: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  generateFormSubmissionCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      const header = this.endpointService.headers();
      const url = this.endpointService.apiHost + 'api/v1/generateSubCode';
      this.http.get( url, { headers: header }).subscribe(
        res => {
          console.log('code_res___: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.code);
        },
        err => {
          console.log('error_____: ' + JSON.stringify(err));
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

  /**
   * Submits a form.
   *
   * @param {string} id
   * @param {string} code
   * @param {*} client_data
   * @param {*} form_data
   * @param {number} updateProfile
   * @param {string} submission_code
   * @param {number} status
   * @param {number} branch_id
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  submitForm(id: string, code: string, client_data: any, form_data: any, updateProfile: number, submission_code: string, status: number, branch_id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = { client_profile: client_data, form_data: form_data, branch_id: branch_id };
      console.log('Body: ' + JSON.stringify(body));
      const url = `${this.endpointService.apiHost}api/v1/submitForm/${id}/${code}/${updateProfile}/${submission_code}/${status}`;
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('form_submitted: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok' ? resolve(true) : resolve(false);
        },
        err => {
          console.log('f_submit_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Edits a client's account.
   *
   * @param {string} id
   * @param {*} profile
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  editProfile(id: string, profile: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(profile);
      console.log('eddddit bodyyyyyy: ' + body);
      const url = this.endpointService.apiHost + 'api/v1/editClientProfile/' + id;
      console.log('i get here');
      this.http.post(url, body, { headers: this.headers }).subscribe(
        res => {
          console.log('editProfile: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('Error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets acoount and forms data info for a client.
   *
   * @param {string} id
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getDetails(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientsDetails/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('___res: ' + JSON.stringify(res));
          resolve(response.client);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all clients.
   *
   * @returns {Promise<any>}
   * @memberof ClientService
   */
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

  emailTncFile(form_code: string, form_name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/emailTnC';
      const body = { form_code: form_code, form_name: form_name };
      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          _.toLower(res.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all forms submitted by a client.
   *
   * @param {string} id
   * @param {string} [page_url]
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getAllSubmittedForms(id: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getClientSubmittedForms/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('submitted forms: ' + JSON.stringify(response.forms.data));
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getAllFavoritesForms(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getRecentForms';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('favorite forms: ' + JSON.stringify(response.form));
          resolve(response.form);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getDeletedForms(client_id: string, page_url?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getAllDeletedSubmittedForms/' + client_id;
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('deleted forms: ' + JSON.stringify(res.forms.data));
          this.nextPaginationUrl = res.forms.next_page_url;
          resolve(res.forms.data);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a the status of a form.
   *
   * @param {string} id
   * @param {string} status
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getFormByStatus(id: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getClientFormsByStatus/' + id + '/' + status;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          console.log('fbs: ' + JSON.stringify(response));
          this.nextPaginationUrl = response.forms.next_page_url;
          resolve(response.forms.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  checkSubmittedFormStatus(id: string, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/checkFormSubmission/${id}/${code}`;
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('chk_sub_form: ' + JSON.stringify(res));
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
   * Auto fills any form with the users already existing data.
   * NOTE: This is the most critical method of the application and should
   * always remain bug free.
   *
   * @param {Array<any>} form_data
   * @param {Array<any>} client_data
   * @memberof ClientService
   */
  autoFillFormData(form_data: Array<any>, client_data: Array<any>) {
    console.log('client_data: ' + JSON.stringify(client_data));
    console.log('form_data: ' + JSON.stringify(form_data));
    _.forEach(form_data, (form, i) => {
      if (!_.isUndefined(form.name)) {
        const element_names = document.getElementsByName(form.name);
        const _element_names = document.getElementsByName(form.name + '[]');
        const client_keys = _.keys(client_data);
        _.forEach(client_keys, (client) => {
          if (form.name == client) {
            console.log(form.name);
            _.forEach(element_names, (element) => {
              const form_field = element as HTMLInputElement;
              // we check if the element is a radio button, checkbox or and input field
              if (form_field.getAttribute('type') == 'radio') {
                _.forEach(form.values, (value) => {
                  const radio_label = form_field.nextSibling.textContent;
                  if (_.toLower(radio_label) == _.toLower(client_data[client])) {
                    form_field.value = client_data[client];
                    form_field.checked = true;
                  }
                });
              }
              else {
                // this is an input, check if a file input or a text input
                form_field.value = client_data[client];
              }
            });

            // For some reason, checkboxes have [] appended to their html name
            // so we get it seperately before we process it.
            _.forEach(_element_names, (element) => {
              const form_field = element as HTMLInputElement;
              if (form_field.type == 'checkbox') {
                // this is a checkbox.
                // NOTE: Value is an array of data.
                const checkbox_label = form_field.nextSibling.textContent;
                console.log('check_lbl: ' + checkbox_label);
                console.log('value: ' + client_data[client]);
                // convert to array
                const values = _.split(client_data[client], ',');
                _.forEach(values, (val) => {
                  if (_.toLower(checkbox_label) == _.toLower(val)) {
                    form_field.value = val;
                    form_field.checked = true;
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  /**
   * Auto fills a client's profile with existing data.
   *
   * @param {Array<any>} form_sections
   * @param {any} client_data
   * @memberof ClientService
   */
  fillClientProfileData(form_sections: Array<any>, client_data: any) {
    _.forEach(form_sections, (section) => {
      console.log('**se: ' + section.heading);
      _.forEach(section.form_fields, (form) => {
        console.log('FormName: ' + form.name);
        if (!_.isUndefined(form.name)) {
          const element_names = document.getElementsByName(form.name);
          const client_keys = _.keys(client_data);
          _.forEach(client_keys, (client) => {
            if (form.name == client) {
              _.forEach(element_names, (element) => {
                const form_field = element as HTMLInputElement;
                // check if the element is a radio button, checkbox or and input field
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
                  // NOTE: Value is an array of data.
                  const checkbox_label = form_field.nextSibling.textContent;
                  console.log('check_lbl: ' + checkbox_label);
                  console.log('value: ' + client_data[client]);

                  // convert to array
                  const values = _.split(client_data[client], ',');
                  _.forEach(values, (val) => {
                    if (_.toLower(checkbox_label) == _.toLower(val)) {
                      form_field.value = val;
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

  /**
   * Gets only the updated/new data added by the client.
   *
   * @param {*} new_form_data
   * @param {*} existing_client_data
   * @returns
   * @memberof ClientService
   */
  getUpdatedClientFormData(new_form_data: any, existing_client_data: any) {
    if (_.isUndefined(existing_client_data) || _.isNull(existing_client_data)) {
      const emptyObj = {};
      return JSON.stringify(emptyObj);
    }
    else {
      const obj = _.toPlainObject(new_form_data);
      const keys = _.keys(obj);
      console.log('existing: ' + existing_client_data);
      if (_.isArray(existing_client_data)) {
        console.log('client_k: ' + _.keys(existing_client_data)[0]);
        _.forEach(keys, (key, i) => {
          existing_client_data[key] = obj[key];
        });
      }
      else {
        console.log('client_kkk: ' + _.keys(existing_client_data));
        _.forEach(keys, (key, i) => {
          existing_client_data[key] = obj[key];
        });
      }
    }

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
  findFormsByName(form_name: string, country: string, sector_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormbyName/' + form_name + '/' + country + '/' + sector_id;
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
   * Searches for a form in the clients history based on the form code the user
   * is searching for.
   *
   * @param {string} client_id
   * @param {string} submission_code
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  findFormsInHistoryByCode(client_id: string, submission_code: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/findSubmittedFormByCode/${client_id}/${submission_code}/${status}`;
      console.log('this is url: ' + url);
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('form_history_by_code: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.forms);
        },
        err => {
          console.log('history_by_code err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Searches for a form in the clients history based on the form name the user
   * is searching for.
   *
   * @param {string} client_id
   * @param {string} form_name
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  findFormsInHistoryByName(client_id: string, form_name: string, status: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/findSubmittedFormByName/${client_id}/${form_name}/${status}`;
      console.log('ddddddd: ' + url);
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('form_history_by_name: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.forms);
        },
        err => {
          console.log('history_by_name err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  findFormsInHistoryByMerchantName(client_id: string, merchant_name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/findClientFormsByMerchantName/${merchant_name}/0/${client_id}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('form_history_by_merchant: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.forms);
        },
        err => {
          console.log('history_by_merchant err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  findFormsInHistoryBySubmissionDate(client_id: string, start_date: string, end_date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('start: ' + start_date);
      console.log('end: ' + end_date);
      const url = this.endpointService.apiHost + `api/v1/findSubmittedFormByDate/${client_id}/0/${start_date}/${end_date}`;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('form_history_by_date: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.forms);
        },
        err => {
          console.log('history_by_date err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  restoreDeletedForm(client_id: string, submission_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/recoverDeletedSubmittedForm/${client_id}/${submission_code}`;
      this.http.post<any>(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('restore_deleted: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('restore_deleted_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  deleteTrashedForm(submission_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/deleteTrash/${submission_code}`;
      this.http.post<any>(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('deleted_trash: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('delete_trash_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Validates a form to make sure all its requyired
   * fields have been filled by the client.
   *
   * @param {Array<any>} form_data
   * @returns
   * @memberof ClientService
   */
  validateFormFilled(form_data: Array<any>) {
    const toFillFormFields: any[] = [];
    _.forEach(form_data, (data) => {
      // we are only checking form fields with the required attribute associated with them
      if (!_.isUndefined(data.required)) {
        console.log('userData: ' + data.userData);
        if (data.type == 'file') {
          // if form filed is a file. it doesnt have a userData property so we check if
          // the field type is a file.
          const elem = document.getElementById(data.name) as HTMLInputElement;
          if (elem.value == '') {
            toFillFormFields.push(data);
          }
        }
        else {
          // if the userData array is empty we return this current form field object
          if (data.userData == '') {
            toFillFormFields.push(data);
          }
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

  /**
   * Uploads form attachments.
   *
   * @param {string} client_id
   * @param {string} form_code
   * @param {string} submission_code
   * @param {string} key
   * @param {File} file
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  uploadFormAttachments(client_id: string, form_code: string, submission_code: string, key: string, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/uploadattachments/${client_id}/${form_code}/${submission_code}`;
      console.log('key: ' + key);
      const form = new FormData();
      form.set('key', key);
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
          console.log('file upload error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Uploads attachments for profile.
   *
   * @param {string} client_id
   * @param {string} key
   * @param {File} file
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  uploadProfileAttachment(client_id: string, key: string, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/uploadProfileAttachments/' + client_id;
      const form = new FormData();

      form.set('key', key);
      form.set('file', file);

      this.http.post(url, form, { headers: this.endpointService.headers(true) }).subscribe(
        res => {
          const response = res as any;
          if (_.toLower(response.message) == 'ok') {
            resolve(true);
          }
          else {
            console.log('file_upload_f_response: ' + JSON.stringify(response));
            resolve(false);
          }
        },
        err => {
          console.log('file upload error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a attachments for a form.
   *
   * @param {string} submission_code
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getFormAttachment(submission_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAttachments/' + submission_code;
      this.http.get(url, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          console.log('response: ' + JSON.stringify(response));
          resolve(response.attachments);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Gets a list of all attachments added to a profile.
   *
   * @param {string} user_id
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getProfileFormAttachment(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getProfileAttachments/' + user_id;
      this.http.get(url, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          console.log('response: ' + JSON.stringify(response));
          resolve(response.attachments);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Displays the rejection message a front desk ad rejected forms.
   *
   * @param {string} submission_code
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  getRejectionReview(submission_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getFormReview/' + submission_code;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('reject review: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.form_review);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a clients form history. Just one item in the history.
   *
   * @param {string} client_id
   * @param {string} submission_code
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  deleteFormHistory(client_id: string, submission_code: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/deleteSubmittedForm/${client_id}/${submission_code}`;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('delete history: ' + JSON.stringify(res));
          const response = res as any;
          response.message == 'ok' ? resolve(true) : resolve(false);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a profile attachment.
   *
   * @param {string} user_id
   * @param {string} key
   * @param {string} file_path
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  deleteProfileAttachment(user_id: string, key: string, file_path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + `api/v1/deleteProfileAttachment/${user_id}/${key}/${file_path}`;
      console.log(url);
      this.http.post(url, {}, { headers: this.endpointService.headers() }).subscribe(
        res => {
          const response = res as any;
          console.log('delete attach message: ' + response.message);
          _.toLower(response.message) == 'ok'
            ? resolve(true) : resolve(false);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Checks to see if a client has a form submission pin.
   *
   * @param {string} client_id
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  checkFormSubmitPin(client_id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const headers = this.endpointService._headers();
      const url = this.endpointService.apiHost + 'api/hasPin/' + client_id;
      this.http.post(url, {}, { headers: headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'yes'
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
   * Creates a new form submission pin.
   *
   * @param {string} user_id
   * @param {string} pin
   * @returns {Promise<any>}
   * @memberof ClientService
   */
  setFormSubmitPin(user_id: string, pin: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/setPin/' + user_id + '/' + pin;
      console.log('______url: ' + url);
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('res___: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Updates an existing form submission pin.
   *
   * @param {string} user_id
   * @param {string} old_pin
   * @param {string} new_pin
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  changeFormSubmitPin(user_id: string, old_pin: string, new_pin: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = { old_pin: old_pin, new_pin: new_pin };
      const url = this.endpointService.apiHost + 'api/v1/changePin/' + user_id;
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(response.message);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Verifies a form submission pin,
   *
   * @param {string} user_id
   * @param {string} pin
   * @returns {Promise<boolean>}
   * @memberof ClientService
   */
  verifyFormSubmitPin(user_id: string, pin: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/checkPin/' + user_id + '/' + pin;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('verify_pin: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('verify_pin_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  suggestMerchant(country: string, merchant_name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        merchant_name: merchant_name,
        country: country
      };
      const url = this.endpointService.apiHost + 'api/v1/suggestMerchant';
      this.http.post( url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('___ress: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response);
        },
        err => {
          console.log('____error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getFormTNC(form_code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      const url = this.endpointService.apiHost + 'api/v1/gettncContent/' + form_code;
      this.http.get<any>(url, { headers: this.headers, responseType: 'text' as 'json' }).subscribe(
        res => {
          // console.log('___ress: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('____error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
