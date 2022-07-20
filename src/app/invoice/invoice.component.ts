import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GetdataService } from '../getdata.service';
import { SendFormsService } from '../send-forms.service';
import * as a from 'angular-animations'
import { Router } from '@angular/router';
import { SendVendorsService } from '../send-vendors.service';
import { Res } from './../vendor/res';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  animations:
    [a.fadeInLeftOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation(),
    a.bounceOnEnterAnimation()]
})
export class InvoiceComponent implements OnInit {
  isFormValidWithFile = false;
  selected_file!: File;
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  options2 !: string[]
  options3 !: string[]
  res !: Res;
  u_klantnaam = ''
  u_new_klantnaam = ''
  u_ID = ''
  isBackendDown = false;
  isKlant = false;
  isID = false;
  isEditing = false;
  isPOEditing = false;
  isBezig = false;
  wantsToEdit = false;
  wantsToAdd = false;
  wantsToPO = false;
  s = 6

  constructor(private getData: GetdataService, 
    private sendForms: SendFormsService, 
    private router: Router, private sendVendors: SendVendorsService) { }

  ngOnInit(): void {
    this.options2 = []
    this.options3 = []
    this.getData.getClients().subscribe((res: any) => {
      this.options2 = res.sort()
      console.log("BackEnd is up! All good!");
      if (this.options2.length < 2) {
        console.log(`Backend down: this.options2.length ${this.options2.length}`)
        this.isBackendDown = true;
      }
    }, (err: any) => {
      console.log(`Backend down: ${err}`)
      this.isBackendDown = true;
    });
    this.getData.getPO().subscribe((res: any) => {
      res.forEach((element: any) => {
        this.options3.push(element.id)
      });
    })

    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
    this.myControl2.valueChanges.subscribe((res) => {
      // Exact match full klant 
      if (this.options2.find((obj) => { this.u_new_klantnaam = obj; return obj.toLowerCase() === res.toLowerCase(); })) {
        this.isKlant = true;
      }
      else {
        this.isKlant = false;
      }
    });
    this.myControl3.valueChanges.subscribe((res) => {
      // Exact match full ID 
      if (this.options3.find((obj) => { return obj === res; })) {
        this.isID = true;
      }
      else {
        this.isID = false;
      }
    });

  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3(value: string): string[] {
    const filterValue = value;
    return this.options3.filter(option => option.toString().includes(filterValue));
  }
  onFileSelected(event: any) {
    this.isFormValidWithFile = true;
    this.selected_file = <File>event.target.files[0]
  }

  onSubmit(f: NgForm) {
    const fd = new FormData();
    fd.append('u_ID',this.u_ID);
    fd.append('file',this.selected_file,this.selected_file.name);
    this.isBezig = true;
      this.doCountdown();
        this.sendVendors.sendInvoice(fd).subscribe((res) => {
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
  }

  checkRes(res: any) {
    console.log(res)
    if (res == "500") {
      alert("Client could NOT be processed! Try again later.")
    }
    else if (res == "200") {
      alert("Client was successfully processed to the list!")
      setTimeout(() => {
        this.u_klantnaam = ""
        this.u_new_klantnaam = ""
      }, 2888);
      this.toHome()
    }
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

  toHome() {
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 5111);
  }
}
