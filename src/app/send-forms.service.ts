import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendFormsService {

  constructor(private http: HttpClient) {
  }

  private url = 'https://formemail.herokuapp.com/sendmail';
  private url_split = 'https://formemail.herokuapp.com/sendmailsplit';

  public sendForm(form_data: any) {
    console.log(form_data)
    if (form_data.bedrag_2 != '' && form_data.merk_2 != '') return this.http.post(this.url_split, form_data)
    else return this.http.post(this.url, form_data)
  }
}
