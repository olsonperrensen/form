import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendFormsService {

  constructor(private http:HttpClient) {
   }

   private url = 'http://localhost:3000/email';
   private headers = {
    headers: new HttpHeaders({'Content-Type':'application-json'})
   }

   public sendForm(form_data:any)
   {
     return this.http.post(this.url,form_data,this.headers);
   }
}
