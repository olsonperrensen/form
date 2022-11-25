import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import * as a from 'angular-animations';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';
import { SendVendorsService } from '../send-vendors.service';
import { Res } from './res';

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
  u_klantnaam = ''
  isKlant = false;
  myControl2 = new FormControl();
  options2!: string[];
  filteredOptions2!: Observable<string[]>;
  isBackendDown = false;
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
  s = 6

  constructor(private router: Router, private sendVendors: SendVendorsService,
    private authService: AuthService, private getData: GetdataService) { }

  ngOnInit(): void {
    this.getData.getNonVendorClients().subscribe((res: any) => {
      this.options2 = res.sort();
      this.isBackendDown = false;
      console.log(`BackEnd is up! ${this.options2.length} All good!`);
      if (this.options2.length < 1000) {
        console.log(`Backend down: this.options2.length ${this.options2.length}`)
        this.isBackendDown = true;
      }
    }, (err) => {
      this.isBackendDown = true;
    });
    setTimeout(() => {
      this.filteredOptions2 = this.myControl2.valueChanges.pipe(
        startWith(''),
        map(value => this._filter2(value)),
      );
    }, 800);
    this.v_worker = this.authService.getCredentials().naam
    document.body.style.backgroundImage = "url('https://u.cubeupload.com/olsonperrensen2/313skyscraperwallpaperu.jpg')"
    setTimeout(() => {
      this.myControl2.valueChanges.subscribe((res) => {
        // Exact match full klant 
        if (this.options2.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
          this.isKlant = true;
        }
        else {
          this.isKlant = false;
        }
      });
    }, 800);
  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
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
      v_file: this.selected_file,
      v_worker: this.v_worker
    }
    if (this.v_klant.length > 2
      && this.v_adres.length > 4
      && this.v_email.length > 4
      && this.v_vat.length > 4
      && this.v_contact.length > 4
      && this.v_worker.length > 4
    ) {
      if (this.v_email.includes("@") && this.v_email.includes(".")
        && this.v_contact.includes(" ") && this.v_adres.includes(" ")
        && this.v_worker.includes(" ")) {

        const fd = new FormData();
        fd.append('v_klant', this.v_klant)
        fd.append('v_adres', this.v_adres)
        fd.append('v_email', this.v_email)
        fd.append('v_gsm', this.v_gsm)
        fd.append('v_vat', this.v_vat)
        fd.append('v_contact', this.v_contact)
        fd.append('v_klantnr', this.v_klantnr)
        fd.append('v_file', this.selected_file, this.selected_file.name)
        fd.append('v_worker', this.v_worker)

        console.log(`About to send:`)
        console.log(this.myJSONForm)
        console.log("Information above.")
        this.isBezig = true;
        this.doCountdown();
        this.sendVendors.sendVendor(fd).subscribe((res) => {
          this.res = <Res>res;
          console.log(res)
          if (this.res.response === "250 Message received") {
            alert("Vendor aanvraag gestuurd!")
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          }
          else {
            alert("Er ging iets mis.")
          }
          this.isBezig = false;
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
    }, 2000);
  }

  onFileSelected(event: any) {
    this.isFormValidWithFile = true;
    this.selected_file = <File>event.target.files[0]
  }
  doCountdown() {
    const myInterval = setInterval(() => {
      this.s--;
      if (this.s < 1) {
        clearInterval(myInterval); setTimeout(() => {
          this.s = 6
        }, 3000);
      }
    }, 1000);
  }
}
