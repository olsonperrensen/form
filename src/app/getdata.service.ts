import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  URL = 'https://formemail.herokuapp.com/clients';
  NONVENDORURL = 'https://formemail.herokuapp.com/nonvendors'
  LOCAL_URL = 'https://formemail.herokuapp.com/clients';
  WORKERS_URL = 'https://formemail.herokuapp.com/workers'

  token = localStorage.getItem('jwtToken'); // Get the JWT token from storage


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
    return this.http.put("https://formemail.herokuapp.com/salesrep", req)
  }

  getPO(req: any) {
    return this.http.post('https://formemail.herokuapp.com/po', { requested_by: req })
  }
  getSalesRep() {
    return this.http.get('https://formemail.herokuapp.com/salesrep')
  }
  getSalesRepDetails(req: any) {
    return this.http.put('https://formemail.herokuapp.com/salesrepdetails', req)
  }

  getVendor() {
    return this.http.get('https://formemail.herokuapp.com/vendor')
  }
  getArchivePO(req: any) {
    return this.http.post('https://formemail.herokuapp.com/archive_po', { requested_by: req })
  }

  getFilterPO(req: any,jaar:any,biz:any) {
    return this.http.post('https://formemail.herokuapp.com/filterpo', { requested_by: req, jaar:jaar,biz:biz })
  }

  getLog() {
    return this.http.get("https://formemail.herokuapp.com/log")
  }

  getFastLog() {
    return this.http.get("https://fourfivezero-a8246d817a17.herokuapp.com/")
  }

  getMeta(f: any) {
    return this.http.post("https://fourfivezero-a8246d817a17.herokuapp.com/f", f)
  }

  getOCR(f: any) {
    return this.http.post("https://fourfivezero-a8246d817a17.herokuapp.com/", f,{
      responseType: 'blob' // Set the response type to 'blob' to handle image data
    })
  }

  editPO(req: any) {
    return this.http.put('https://formemail.herokuapp.com/po', req)
  }
  editBetaling(req: any) {
    return this.http.put('https://formemail.herokuapp.com/betaald', req)
  }
  editGR(req: any) {
    return this.http.put('https://formemail.herokuapp.com/gr', req)
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
  delGR(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('https://formemail.herokuapp.com/gr', options);
  }
  delSalesRep(req: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: req,
    };

    return this.http.delete('https://formemail.herokuapp.com/salesrep', options);
  }

  constructor(private http: HttpClient) { }
}
