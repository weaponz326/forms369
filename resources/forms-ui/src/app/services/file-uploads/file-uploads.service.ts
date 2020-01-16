import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
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

  /**
   * Converts a base64 encoded image string to a Javascript File object.
   *
   * @param {string} dataUrl
   * @param {string} filename
   * @returns {File}
   * @memberof FileUploadsService
   */
  convertBase64ToFile(dataUrl: string, filename: string): File {
    console.log('converting to base64');
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Converts an image using the image url to a base64 encoded string.
   *
   * @param {string} src
   * @returns
   * @memberof FileUploadsService
   */
  srcToBase64(url: string): Promise<string> {
    console.log('srcToBase64');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      this.http.get(url, { responseType: 'blob' }).subscribe(
        blob => {
          reader.readAsDataURL(blob);
          reader.onload = () => resolve(reader.result.toString());
          reader.onerror = error => reject(error);
        }
      );
    });
  }
}
