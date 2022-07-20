import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SendVendorsService {
  constructor(private http: HttpClient) {
  }


  private url = 'https://formemail.herokuapp.com/vendor';

  public sendVendor(form_data: any) {
    return this.http.post(this.url, form_data);
  }
  public sendInvoice(form_data: any) {
    return this.http.post('https://formemail.herokuapp.com/invoice', form_data);
  }
}
