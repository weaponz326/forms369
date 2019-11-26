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

  /**
   * Creates a new form section.
   *
   * @param {*} section
   * @returns {Promise<any>}
   * @memberof SectionsService
   */
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

  /**
   * Edits a form section.
   *
   * @param {string} section_id
   * @param {*} section
   * @returns {Promise<any>}
   * @memberof SectionsService
   */
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

  /**
   * Returns a list of all form sections.
   *
   * @returns {Promise<any>}
   * @memberof SectionsService
   */
  getAllSections(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllSections';
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {},
        err => {}
      );
    });
  }

  /**
   * Searches for a form section using the section header.
   *
   * @param {string} search_term
   * @returns {Promise<any>}
   * @memberof SectionsService
   */
  findSection(search_term: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/searchSectionByHeading/' + search_term;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {},
        err => {}
      );
    });
  }

  /**
   * Deletes a form section.
   *
   * @param {string} section_id
   * @returns {Promise<any>}
   * @memberof SectionsService
   */
  deleteSection(section_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/deleteSection/' + section_id;
      this.http.post(url, {}, { headers: this.headers }).subscribe(
        res => {},
        err => {}
      );
    });
  }
}
