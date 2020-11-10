import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class AbuseReportsService {

  private headers: HttpHeaders;
  public nextPaginationUrl: string;

  constructor(private http: HttpClient, private endpointService: EndpointService) {
    this.headers = this.endpointService.headers();
  }

  /**
   * Returns a list of all abuse reports.
   */
  getAbuseReports(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAllAbuseReports';
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res.abuse_reports);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of all abuse reports which the specified status.
   * @param status The report status.
   */
  getAbuseReportsByStatus(status: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAbuseReportsByStatus/' + status;
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Addresses/takes care of an abuse report.
   * @param id Abuse report ID.
   */
  addressAbuseReport(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/addressAbuseReport/' + id;
      this.http.post<any>(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          _.toLower(res.message) == 'ok'
            ? resolve(true)
            : resolve(false);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  /**
   * Gets details on a report.
   * @param id Report ID.
   */
  getAbuseReportDetails(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getAbuseReportDetails/' + id;
      this.http.get(url, { headers: this.headers }).subscribe(
        res => {
          console.log('res: ' + JSON.stringify(res));
          // resolve(res);
        },
        err => {
          console.log('error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
