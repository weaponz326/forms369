import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Injectable, ElementRef } from '@angular/core';

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
   * Exports table data to CSV format.
   *
   * @param {string} table_id
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToCsv(data: any, filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename + '.csv');
  }

  /**
   * Exports table data to Excel format.
   *
   * @param {*} data
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToExcel(data: any, filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '.xlsx');
  }

  /**
   * Exports an html element data to PDF format.
   *
   * @param {string} element_id
   * @param {string} filename
   * @memberof DownloaderService
   */
  exportToPDF(content: ElementRef, filename: string) {
    const doc = new jsPDF.jsPDF();
    const specialElementHandlers = {
      '#editor': (element, renderer) => {
        return true;
      }
    };

    const _content = content.nativeElement;
    doc.fromHTML(_content.innerHTML, 15, 15, {
      'width': 198,
      'elementHandlers': specialElementHandlers
    });

    doc.save(filename);
  }
}
