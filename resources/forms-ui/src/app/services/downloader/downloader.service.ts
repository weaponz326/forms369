import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(private http: HttpClient) { }

  /**
   * Downloads a file.
   *
   * @param {string} url
   * @memberof DownloaderService
   */
  download(url: string) {
    const index = url.lastIndexOf('/') + 1;
    const downloaded_file_name = url.substr(index);
    this.http.get(url, { responseType: 'blob' }).subscribe(
      blob => {
        saveAs(blob, downloaded_file_name);
      }
    );
  }
}
