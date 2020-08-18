import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { AddToQueue } from 'src/app/models/add-to-queue.model';

@Injectable({
  providedIn: 'root'
})
export class QMSQueueingService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private logger: LoggingService, private endpointService: EndpointService) {}

  authenticateQmsEndpoint(merchant_id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/getQMSToken/' + merchant_id;
      const headers = this.endpointService.headers();

      this.http.post<any>(url, {}, { headers: headers }).subscribe(
        res => {
          this.logger.log('QMS_auth_token: ' + JSON.stringify(res));
          resolve(res.message);
        },
        err => {
          this.logger.log('QMS_auth_error: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getBranchServices(token: string, branch_ext: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.headers = this.endpointService.headers();

      const body = {'ext': branch_ext, 'token': token};
      const url = this.endpointService.apiHost + 'api/v1/getQMSBranchServices';
      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          this.logger.log('qms_branch_services: ' + JSON.stringify(res));
          res.message.error == 0 ? resolve(res.message.data) : resolve([]);
        },
        err => {
          this.logger.log('qms_branch_services_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  getCustomerServices(token: string, branch_ext: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.headers = this.endpointService.headers();

      const body = { 'ext': branch_ext, 'token': token };
      const url = this.endpointService.apiHost + 'api/vi/getQMSCustomerServices';
      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          this.logger.log('qms_customer_services: ' + JSON.stringify(res));
          res.error == 0 ? resolve(res.data) : resolve([]);
        },
        err => {
          this.logger.log('qms_customer_services_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  addCustomerToBranchQueue(token: string, queue: AddToQueue): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        'token': token,
        'ext': queue.branch_ext,
        'join_now': queue.join_now,
        'entry_src': queue.entry_src,
        'join_at_time': queue.join_at_time,
        'service_type': queue.service_type,
        'client_mobile': queue.client_mobile,
        'is_multi_services': queue.is_multi_services,
        'single_service_id': queue.single_service_id,
        'multiple_services': queue.multiple_services,
      };
      this.headers = this.endpointService.headers();
      const url = this.endpointService.apiHost + 'api/v1/QMSJoinQueue';
      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          this.logger.log('qms_add_queue ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          this.logger.log('qms_add_queue_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  cancelQueueRequest(token: string, client_mobile: string, branch_ext: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        'token': token,
        'ext': branch_ext,
        'client_mobile': client_mobile
      };
      this.headers = this.endpointService.headers();
      const url = this.endpointService.apiHost + 'api/v1/QueueCancelRequest';
      this.http.post<any>(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          this.logger.log('qms_add_queue ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          this.logger.log('qms_add_queue_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
