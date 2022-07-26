import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dbUser = { isAuthenticated: false, id: 0, username: '', naam: '', sbu: '', land: "" };
  private guardStatus = false;
  private URL = 'https://formemail.herokuapp.com/login';
  private RECOVER_URL = 'https://formemail.herokuapp.com/recover';
  private RESET_URL = 'https://formemail.herokuapp.com/reset'
  private loggedIn = false;

  isAuthenticated(secret: any) {
    return this.http.post(this.URL, secret);
  }

  setCredentials(u_user: any) {
    this.dbUser.id = u_user.id;
    this.dbUser.isAuthenticated = u_user.isAuthenticated;
    this.dbUser.land = u_user.land;
    this.dbUser.naam = u_user.naam;
    this.dbUser.sbu = u_user.sbu;
    this.dbUser.username = u_user.username;
  }

  getCredentials() {
    return this.dbUser;
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