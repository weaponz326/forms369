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

  getAllFormsProcessedByUser(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllFormsProcessedByFrontDeskPerson/' + user_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
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

  getSubmittedFormByStatusAndMerchant(status: number, merchant_id: string, page_url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(page_url)
        ? page_url
        : this.endpointService.apiHost + 'api/v1/getSubmittedFormByStatusAndMerchant/' + status + '/' + merchant_id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          const response = res as any;
          this.nextPaginationUrl = response.submitted_forms.next_page_url;
          resolve(response.submitted_forms.data);
        },
        err => {
          console.log('err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getRespondantData(form_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/viewRespondentData/' + form_code;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {},
        err => {}
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

  completeForm(code: string, clientData: any): Promise<any> {
    return new Promise((resolve, reject) => {
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

  unprocessForm(code: string, clientData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/processSubmitForm/' + code + '/' + '0';
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
