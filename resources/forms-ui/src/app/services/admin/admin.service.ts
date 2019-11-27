import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UserTypes } from 'src/app/enums/user-types.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  getGitAdmins(allowPagination?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = !_.isUndefined(allowPagination) || allowPagination
        ? this.endpointService.apiHost + 'api/v1/getAllUsersByType/' + UserTypes.GitAdmin
        : this.endpointService.apiHost + 'api/v1/getAllUsersByTypeForDropdown/' + UserTypes.GitAdmin;
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

  getAllUsersByMerchant(user_type: number, merchant_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getMerchantUsersByType/' + merchant_id + '/' + user_type;
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
}
