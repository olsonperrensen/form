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
  myControl3 = new FormControl();
  filteredOptions3!: Observable<string[]>;
  options3 !: string[]
  res !: Res;
  u_ID = ''
  isBackendDown = false;
  isID = false;
  isBezig = false;
  s = 6

  constructor(private getData: GetdataService,
    private sendForms: SendFormsService,
    private router: Router, private sendVendors: SendVendorsService) { }

  ngOnInit(): void {
    this.options3 = [];
    this.getData.getPO().subscribe((res: any) => {
      res.forEach((element: any) => {
        this.options3.push(element.id)
      });
    })
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
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
    fd.append('u_ID', this.u_ID);
    fd.append('file', this.selected_file, this.selected_file.name);
    this.isBezig = true;
    this.doCountdown();
    this.sendVendors.sendInvoice(fd).subscribe((res) => {
      this.res = <Res>res;
      this.checkRes(res)
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
