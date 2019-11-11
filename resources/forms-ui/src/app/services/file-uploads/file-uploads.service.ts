import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

  private headers: HttpHeaders;
  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers(true);
  }

  /**
   * Uploads a company logo and returns the image name.
   *
   * @param {File} logo
   * @returns {Promise<string>}
   * @memberof FileUploadsService
   */
  uploadCompanyLogo(logo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/uploadImage';
      const form = new FormData();
      form.set('image', logo);
      this.http.post(url, form, { headers: this.headers }).subscribe(
        res => {
          const name = res as any;
          resolve(name.image_name);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
