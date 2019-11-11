import { Injectable } from '@angular/core';
import { Users } from 'src/app/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveUserInformation(user: Users) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): Users {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  public set token(v: string) {
    sessionStorage.setItem('x-auth', v);
  }

  public get token(): string {
    return sessionStorage.getItem('x-auth');
  }

}
