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
   * Retruns a base64 encoded string from the HTMLImageElement.
   *
   * @private
   * @param {HTMLImageElement} img
   * @returns
   * @memberof FileUploadsService
   */
  private getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    // const dataURL = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    return dataURL;
  }

  /**
   * Converts an image using the image url to a base64 encoded string.
   *
   * @param {string} src
   * @param {string} mime_type
   * @returns
   * @memberof FileUploadsService
   */
  srcToBase64(src: string, mime_type: string) {
    return new Observable((observer: Observer<string>) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'Anonymous';
      if ( !img.complete ) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };

        img.onerror = (err) => {
          observer.error(err);
        };
      }
      else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
}
