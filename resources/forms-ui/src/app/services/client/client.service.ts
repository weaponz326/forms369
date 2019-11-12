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

  submitForm(id: string, code: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(data);
      const url = this.endpointService.apiHost + 'api/v1/submitForm/' + id + '/' + code;
      this.http.post(url, body, { headers: this.headers }).subscribe(
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
      const url = this.endpointService.apiHost + 'api/v1/getAllsubmittedForms/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('submitted forms: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.submitted_forms.data);
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

  findFormsByCode(form_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/';
      this.http.get(url, { headers: this.headers }).subscribe();
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
}
