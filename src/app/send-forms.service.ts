import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendFormsService {

  constructor(private http:HttpClient) {
   }

   private url = 'https://formemail.herokuapp.com/sendmail';

   public sendForm(form_data:any)
   {
    console.log(form_data)
     return this.http.post(this.url,form_data);
   }
}
