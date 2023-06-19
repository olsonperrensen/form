import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token!: any;
  private tokenKey = '9__BvprarHTGluMH$XZHO0JRcGQAvsT-EFIlsOBetoxs#4';
  apiUrl = environment.apiUrl;
  private dbUser = { isAuthenticated: false, id: 0, username: '', naam: '', sbu: '', land: "" };
  private guardStatus = false;
  private URL = `${this.apiUrl}/login`;
  private RECOVER_URL = `${this.apiUrl}/recover`;
  private RESET_URL = `${this.apiUrl}/reset`
  private loggedIn = false;

  isAuthenticated(secret: any) {
    return this.http.post(this.URL, secret);
  }

  setLocalStorageCredentials(u_user: any) {
    localStorage.setItem('naam', this.dbUser.naam);
    localStorage.setItem('land', this.dbUser.land);
    localStorage.setItem('sbu', this.dbUser.sbu);
  }

  setCredentials(u_user: any) {
    this.dbUser.id = u_user.id;
    this.dbUser.isAuthenticated = u_user.isAuthenticated;
    this.dbUser.land = u_user.land;
    this.dbUser.naam = u_user.naam;
    this.dbUser.sbu = u_user.sbu;
    this.dbUser.username = u_user.username;
    this.setLocalStorageCredentials(u_user)
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

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  public getLocalStorageCredentials(): any[] {
    const A = [localStorage.getItem('land'), localStorage.getItem('naam')]
    return A;
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public isJWTAuthenticated(): boolean {
    this.token = this.getToken();
    return this.token && !this.jwtHelper.isTokenExpired(this.token);
  }

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
    if (this.guardStatus) return this.guardStatus
    else return this.isJWTAuthenticated()
  }
}