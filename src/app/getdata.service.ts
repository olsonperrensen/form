import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  url = 'https://formemail.herokuapp.com/clients';

  getClients()
  {
    return this.http.get(this.url);
  }

  postClient(req:any)
  {
    return this.http.post('http://localhost:3000/clients',req);
  }

  constructor(private http:HttpClient) { }
}
