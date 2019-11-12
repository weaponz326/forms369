import { Injectable } from '@angular/core';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FrontDeskService {

  headers: HttpHeaders;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  getFrontDeskAccounts(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.FrontDesk;
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

  getSubmittedForms(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllsubmittedForms';
    });
  }

  getForm(form_code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getSubmittedFormByCode/' + form_code;
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
}
