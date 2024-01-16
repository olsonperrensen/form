import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import * as a from 'angular-animations';
import { AuthService } from '../auth.service';
import { SendVendorsService } from '../send-vendors.service';
import { Res } from './res';
import { Location } from '@angular/common';

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
  isFormValidWithFile = false;
  v_klant = ""
  v_adres = ""
  v_email = ""
  v_gsm = ""
  v_vat = ""
  v_contact = ""
  v_klantnr = ""
  v_file!: File;
  v_worker = '';
  myJSONForm = {};
  selected_file!: File;
  res !: Res;
  isBezig = false;
  

  constructor(private router: Router, private sendVendors: SendVendorsService,
    private location: Location,private authService: AuthService) { }

  ngOnInit(): void {
    this.v_worker = this.authService.getCredentials().naam
    document.body.style.backgroundImage = "url('https://u.cubeupload.com/olsonperrensen2/313skyscraperwallpaperu.jpg')"
  }
  async onSubmit(f: NgForm) {
    this.myJSONForm = {
      v_klant: this.v_klant,
      v_adres: this.v_adres,
      v_email: this.v_email,
      v_gsm: this.v_gsm,
      v_vat: this.v_vat,
      v_contact: this.v_contact,
      v_klantnr: this.v_klantnr,
      v_file: this.selected_file,
      v_worker: this.v_worker
    };

    if (
      this.v_klant.length > 2 &&
      this.v_adres.length > 4 &&
      this.v_email.length > 4 &&
      this.v_vat.length > 4 &&
      this.v_contact.length > 4 &&
      this.v_worker.length > 4
    ) {
      if (
        this.v_email.includes("@") &&
        this.v_email.includes(".") &&
        this.v_contact.includes(" ") &&
        this.v_adres.includes(" ") &&
        this.v_worker.includes(" ")
      ) {
        const fd = new FormData();
        fd.append('v_klant', this.v_klant);
        fd.append('v_adres', this.v_adres);
        fd.append('v_email', this.v_email);
        fd.append('v_gsm', this.v_gsm);
        fd.append('v_vat', this.v_vat);
        fd.append('v_contact', this.v_contact);
        fd.append('v_klantnr', this.v_klantnr);
        fd.append('v_file', this.selected_file, this.selected_file.name);
        fd.append('v_worker', this.v_worker);

        try {
          this.isBezig = true;
          const res = await this.sendVendors.sendVendor(fd).toPromise();
          this.res = <Res>res;
          if (this.res.response === "250 Message received") {
            alert("Vendor aanvraag gestuurd!");
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 400);
          } else {
            alert("Er ging iets mis.");
          }
          this.isBezig = false;
        } catch (err) {
          console.error(err);
          this.isBezig = false;
        }

        this.isFormInvalid = false;
      } else {
        this.isFormInvalid = true;
      }
    } else {
      this.isFormInvalid = true;
    }
  }


  onCancel() {
    this.v_klant = ""
    this.v_adres = ""
    this.v_email = ""
    this.v_gsm = ""
    this.v_vat = ""
    this.v_contact = ""
    this.v_klantnr = ""
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1400);
  }

  onFileSelected(event: any) {
    this.isFormValidWithFile = true;
    this.selected_file = <File>event.target.files[0]
  }
  goBack(): void {
    this.location.back();
  }
}
