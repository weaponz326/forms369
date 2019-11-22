import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Creates a new form template.
   *
   * @param {*} template_data
   * @returns {Promise<any>}
   * @memberof TemplatesService
   */
  createTemplate(template_data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(template_data);
      const url = this.endpointService.apiHost + 'api/v1/createTemplate';
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

  /**
   * Edits a form template.
   *
   * @param {string} template_id
   * @param {*} template_data
   * @returns {Promise<any>}
   * @memberof TemplatesService
   */
  editTemplate(template_id: string, template_data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(template_data);
      console.log('body: ' + body);
      const url = this.endpointService.apiHost + 'api/v1/editTemplate/' + template_id;
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

  /**
   * Search for a template bybthe template name.
   *
   * @param {string} search_term
   * @returns {Promise<any>}
   * @memberof TemplatesService
   */
  findTemplate(search_term: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/searchTemplateByName/' + search_term;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('templates: ' + JSON.stringify(res));
          const response = res as any;
          resolve(response.templates);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all form templates.
   *
   * @returns {Promise<any>}
   * @memberof TemplatesService
   */
  getAllTemplates(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllTemplates';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          const response = res as any;
          resolve(response.templates.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a form template.
   *
   * @param {string} template_id
   * @returns {Promise<any>}
   * @memberof TemplatesService
   */
  deleteTemplate(template_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deleteTemplate/' + template_id;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('template deleted: ' + JSON.stringify(res));
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
