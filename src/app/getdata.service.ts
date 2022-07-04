import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  url = 'https://formemail.herokuapp.com/clients';
  local_url = 'http://localhost:3000/clients';

  getClients() {
    return this.http.get(this.url);
  }

  postClient(req: any) {
    return this.http.post(this.url, req);
  }

  delClient(req: any) {
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        old_client: req
      },
    };

    return this.http.delete(this.url, options);
  }

  updateClient(req: any) {
    return this.http.put(this.url, req)
  }


  constructor(private http: HttpClient) { }
}
