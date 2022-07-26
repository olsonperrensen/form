import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private guardStatus = false;
  private URL = 'https://formemail.herokuapp.com/login';
  private RECOVER_URL = 'https://formemail.herokuapp.com/recover';
  private RESET_URL = 'https://formemail.herokuapp.com/reset'
  private loggedIn = false;

  isAuthenticated(secret: any) {
    return this.http.post(this.URL, secret);
  }

  recoverPWD(u_username: any) {
    return this.http.post(this.RECOVER_URL, { u_username: u_username });
  }

  resetPWD(u_id: any, u_pwd: any) {
    return this.http.post(this.RESET_URL, { u_id: u_id, u_pwd: u_pwd });
  }

  constructor(private http: HttpClient) { }

  login() {
    this.loggedIn = true;
  }
  logout() {
    this.loggedIn = false;
  }

  setGuardStatus(val: boolean) {
    if (val === true) {
      this.guardStatus = val
    }
  }
  getGuardStatus() {
    return this.guardStatus
  }
}