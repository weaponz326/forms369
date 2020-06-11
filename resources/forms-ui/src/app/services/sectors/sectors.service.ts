import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  createSector(sector_name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/createBusinessSector';
      const body = { name: sector_name };
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('sector_created: ' + JSON.stringify(res));
          const response = res as any;
          _.toLower(response.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('error creating sector: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  editSector(id: string, name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {});
  }

  getSectors(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllBusinessSectors';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('response: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.business_sectors);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  deleteSector(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {});
  }
}
