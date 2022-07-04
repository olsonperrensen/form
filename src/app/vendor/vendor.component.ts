import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import * as a from 'angular-animations';
import { SendVendorsService } from '../send-vendors.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations: [
    a.fadeInLeftOnEnterAnimation(),
    a.bounceOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation()
  ]
})
export class VendorComponent implements OnInit {
  isFormInvalid = false;
  v_klant = ""
  v_adres = ""
  v_email = ""
  v_gsm = ""
  v_vat = ""
  v_contact = ""
  v_klantnr = ""
  v_file!: File;
  myJSONForm = {}

  constructor(private router: Router, private sendVendors: SendVendorsService) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    this.myJSONForm = {
      v_klant: this.v_klant,
      v_adres: this.v_adres,
      v_email: this.v_email,
      v_gsm: this.v_gsm,
      v_vat: this.v_vat,
      v_contact: this.v_contact,
      v_klantnr: this.v_klantnr,
      v_file: this.v_file
    }
    if (this.v_klant.length > 1
      && this.v_adres.length > 1
      && this.v_email.length > 1
      && this.v_vat.length > 1
      && this.v_contact.length > 1
    ) {
      this.sendVendors.sendVendor(this.myJSONForm).subscribe((res) => {
        console.log(res)
      })
    }
    else {
      this.isFormInvalid = true;
    }
  }

  onCancel(f: NgForm) {
    this.v_klant = ""
    this.v_adres = ""
    this.v_email = ""
    this.v_gsm = ""
    this.v_vat = ""
    this.v_contact = ""
    this.v_klantnr = ""
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }


}
