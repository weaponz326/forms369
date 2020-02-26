declare var pdfMake: any;
declare var html2pdf: any;
declare var html2canvas: any;
import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  exportToPDF(element_id: string, filename: string) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFontSize(20);
    pdf.addHTML(document.getElementById(element_id), () => {
      pdf.save(filename + '.pdf');
    });
  }
}
