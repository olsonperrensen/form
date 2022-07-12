import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  url = 'https://formemail.herokuapp.com/clients';
  local_url = 'http://localhost:3000/clients';
  isBackendDown = false;

  getServerStatus() {
    return this.http.get('https://formemail.herokuapp.com/')
  }

  setServerStatus(b: boolean) {
    this.isBackendDown = b;
  }
  getBackendBoolean() {
    return this.isBackendDown;
  }

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

  getPO() {
    return this.http.get('https://formemail.herokuapp.com/po')
  }
  getVendor() {
    return this.http.get('https://formemail.herokuapp.com/vendor')
  }
  getArchivePO() {
    return this.http.get('https://formemail.herokuapp.com/archive_po')
  }
  editPO(req: any) {
    return this.http.put('https://formemail.herokuapp.com/po', req)
  }
  delPO(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('https://formemail.herokuapp.com/po', options);
  }

  constructor(private http: HttpClient) { }
}
