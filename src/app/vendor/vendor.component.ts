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
  myJSONForm = {};
  selected_file!:File;

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
      v_klantnr: this.v_klantnr
    }
    if (this.v_klant.length > 2
      && this.v_adres.length > 4
      && this.v_email.length > 4
      && this.v_vat.length > 4
      && this.v_contact.length > 4
    ) {
      if (this.v_email.includes("@") && this.v_email.includes(".")
        && this.v_contact.includes(" ") && this.v_adres.includes(" ")) {

          const fd = new FormData();
          fd.append('image',this.selected_file,this.selected_file.name)
          console.log(`About to send`)
          console.log(this.myJSONForm)
          console.log(fd)
          console.log("Information above.")
        this.sendVendors.sendVendor({plainText:this.myJSONForm,blob:fd}).subscribe((res) => {
          console.log(res)
        });

        this.isFormInvalid = false;
      }
      else {
        this.isFormInvalid = true;
      }
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

  onFileSelected(event: any) {
    this.selected_file = <File>event.target.files[0]
  }
}
