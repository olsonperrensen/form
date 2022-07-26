import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  URL = 'https://formemail.herokuapp.com/clients';
  LOCAL_URL = 'http://localhost:3000/clients';
  WORKERS_URL = 'https://formemail.herokuapp.com/workers'

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
    return this.http.get(this.URL);
  }

  getWorkers() {
    return this.http.get(this.WORKERS_URL);
  }

  postClient(req: any) {
    return this.http.post(this.URL, req);
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

    return this.http.delete(this.URL, options);
  }

  updateClient(req: any) {
    return this.http.put(this.URL, req)
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
