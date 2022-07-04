import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private guardStatus = false;
  private url = 'https://formemail.herokuapp.com/login';
  private loggedIn = false;

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

  setGuardStatus(val:boolean)
  {
    if(val===true)
    {
      this.guardStatus = val
    }
  }
  getGuardStatus()
  {
    return this.guardStatus
  }
}