import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  createSection(section: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(section);
      const url = this.endpointService.apiHost + 'api/v1/createSection';
      this.http.post(url, body, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('res: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  editSection(section_id: string, section: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(section);
      const url = this.endpointService.apiHost + 'api/v1/editSection/' + section_id;
      this.http.post(url, body, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('res: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getSection(section_id: string): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  getAllSections(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllSections';
    });
  }

  findSection(search_term: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/searchSectionByHeading/' + search_term;
    });
  }

  deleteSection(section_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deleteSection/' + section_id;
    });
  }
}
