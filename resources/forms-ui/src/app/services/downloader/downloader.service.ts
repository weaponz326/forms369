declare var pdfMake: any;
declare var html2canvas: any;
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
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

  /**
   * Exports table data to Excel format.
   *
   * @param {string} table_id
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToExcel(table_id: string, filename: string) {
    let download_link = null;
    const data_type = 'application/vnd.ms-excel';
    const table_selector = document.getElementById(table_id);
    const html_table = table_selector.outerHTML.replace(/ /g, '%20');

    // specify the filename
    filename = filename + '.xls';

    // create download link lement
    download_link = document.createElement('a');
    document.body.appendChild(download_link);

    if (navigator.msSaveOrOpenBlob) {
      const blob = new Blob(['\ufeff', html_table], {
        type: data_type
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      // create a link to the file
      download_link.href = 'data:' + data_type + ', ' + html_table;
      download_link.download = filename;

      // trigger the download
      download_link.click();
    }
  }

  /**
   * Exports table data to CSV format.
   *
   * @param {string} table_id
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToCsv(table_id: string, filename: string) {
    let download_link = null;
    const data_type = 'application/vnd.ms-excel';
    const table_selector = document.getElementById(table_id);
    const html_table = table_selector.outerHTML.replace(/ /g, '%20');

    // specify the filename
    filename = filename + '.csv';

    // create download link lement
    download_link = document.createElement('a');
    document.body.appendChild(download_link);

    if (navigator.msSaveOrOpenBlob) {
      const blob = new Blob(['\ufeff', html_table], {
        type: data_type
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      // create a link to the file
      download_link.href = 'data:' + data_type + ', ' + html_table;
      download_link.download = filename;

      // trigger the download
      download_link.click();
    }
  }

  /**
   * Exports an html element data to PDF format.
   *
   * @param {string} element_id
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToPDF(element_id: string, filename: string) {
    html2canvas(document.getElementById(element_id), {
      onrendered: (canvas) => {
        const data = canvas.toDataURL();
        const doc_definition = {
          content: [{
            image: data,
            width: 900
          }]
        };
        pdfMake.createPdf(doc_definition).download(filename + '.pdf');
      }
    });
  }
}
