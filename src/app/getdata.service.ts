import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  URL = 'http://localhost:3000/clients';
  NONVENDORURL = 'http://localhost:3000/nonvendors'
  LOCAL_URL = 'http://localhost:3000/clients';
  WORKERS_URL = 'http://localhost:3000/workers'

  token = localStorage.getItem('jwtToken'); // Get the JWT token from storage


  isBackendDown = false;

  getServerStatus() {
    return this.http.get('http://localhost:3000/')
  }

  setServerStatus(b: boolean) {
    this.isBackendDown = b;
  }
  getBackendBoolean() {
    return this.isBackendDown;
  }

  getClients() {
    // Create the headers object with Authorization header containing the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(this.URL, { headers });
  }

  getNonVendorClients() {
    return this.http.get(this.NONVENDORURL);
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
  updateSalesRep(req: any) {
    return this.http.put("http://localhost:3000/salesrep", req)
  }

  getPO(req: any) {
    return this.http.post('http://localhost:3000/po', { requested_by: req })
  }
  getSalesRep() {
    return this.http.get('http://localhost:3000/salesrep')
  }
  getSalesRepDetails(req: any) {
    return this.http.put('http://localhost:3000/salesrepdetails', req)
  }

  getVendor() {
    return this.http.get('http://localhost:3000/vendor')
  }
  getArchivePO(req: any) {
    return this.http.post('http://localhost:3000/archive_po', { requested_by: req })
  }

  getLog() {
    return this.http.get("http://localhost:3000/log")
  }

  editPO(req: any) {
    return this.http.put('http://localhost:3000/po', req)
  }
  editBetaling(req: any) {
    return this.http.put('http://localhost:3000/betaald', req)
  }
  editGR(req: any) {
    return this.http.put('http://localhost:3000/gr', req)
  }
  delPO(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('http://localhost:3000/po', options);
  }
  delGR(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('http://localhost:3000/gr', options);
  }
  delSalesRep(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('http://localhost:3000/salesrep', options);
  }

  constructor(private http: HttpClient) { }
}
