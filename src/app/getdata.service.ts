import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  url = 'http://localhost:3000/clients';

  getClients()
  {
    return this.http.get(this.url);
  }

  constructor(private http:HttpClient) { }
}
