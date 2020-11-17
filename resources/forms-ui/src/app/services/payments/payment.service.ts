import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '../endpoint/endpoint.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  headers: HttpHeaders;
  constructor(private http: HttpClient, private localStorage: LocalStorageService, private endpointService: EndpointService) { }

  makeCardPayment(amount: string, currency: string, issuer: string, card_number: string, exp_month: string, exp_year: string, cvv: string, card_holder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const email = this.localStorage.getUser().email;
      const url = this.endpointService.apiHost + 'api/v1/collectPayment';
      const body = {
        cvv: cvv,
        email: email,
        amount: amount,
        r_switch: issuer,
        pan: card_number,
        exp_year: exp_year,
        currency: currency,
        exp_month: exp_month,
        card_holder: card_holder
      };

      console.log(body);
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('card_pay_success: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('card_pay_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  makeMobileMoneyPayment(amount: string, network_provider: string, phone_number: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.endpointService.apiHost + 'api/v1/collectPaymentMoMo';
      const body = {
        amount: amount,
        r_switch: network_provider,
        subscriber_number: phone_number,
      };

      console.log(body);
      this.http.post(url, JSON.stringify(body), { headers: this.headers }).subscribe(
        res => {
          console.log('momo_pay_success: ' + JSON.stringify(res));
          resolve(res);
        },
        err => {
          console.log('momo_pay_err: ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }
}
