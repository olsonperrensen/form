import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'https://formemail.herokuapp.com/clients';
  loggedIn = false;

  isAuthenticated(secret:any)
  {
    return this.http.post(this.url,secret);
  }

  constructor(private http:HttpClient) { }

  login()
  {
    this.loggedIn = true;
  }
  logout()
  {
    this.loggedIn = false;
  }
}