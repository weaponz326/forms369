import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(message?: any) {
    const host = window.location.origin;
    const is_localhost = host == 'http://localhost:4200' ? true : false;
    is_localhost ? console.log(message) : null;
  }
}
