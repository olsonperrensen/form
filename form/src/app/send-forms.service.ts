import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendFormsService {

  constructor(private http:HttpClient) {
   }

   private url = 'http://olsonperrensen.github.io/db.json';

   public sendForm(form_data:any)
   {
     return this.http.post(this.url,form_data);
   }
}
