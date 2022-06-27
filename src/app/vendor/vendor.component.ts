import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as a from 'angular-animations';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations:[
    a.fadeInLeftOnEnterAnimation()]
})
export class VendorComponent implements OnInit {

  v_klant = ""
  v_adres = ""
  v_email = ""
  v_gsm = ""
  v_vat = ""
  v_contact = ""
  v_klantnr = ""

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm)
  {
    
  }
  pdfInputChange(e:Event)
  {
    
  }
  onCancel(f:NgForm)
  {
    this.v_klant = ""
    this.v_adres = ""
    this.v_email = ""
    this.v_gsm = ""
    this.v_vat = ""
    this.v_contact = ""
    this.v_klantnr = ""
  }
}
