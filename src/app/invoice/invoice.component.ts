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
import { AuthService } from '../auth.service';
import { PO } from './PO';

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
  allPO: PO[] = [];
  selectedPO !: PO;
  postatus = ''
  wantsOne = false;
  wantsAll = false;
  isFormValidWithFile = false;
  selected_files: File[] = [];
  myControl3 = new FormControl();
  myControl3_multiple = new FormControl();
  filteredOptions3!: Observable<string[]>;
  options3 !: string[]
  res !: Res;
  u_ID = '';
  selectedIDs!: any;
  ref = '';
  isBackendDown = false;
  isID = false;
  isBezig = false;
  s = 6
  u_worker = this.authService.getLocalStorageCredentials()[1]
  found = false;

  constructor(private getData: GetdataService,
    private sendForms: SendFormsService,
    private router: Router, private sendVendors: SendVendorsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.options3 = [];
    this.getData.getPO(this.u_worker.toUpperCase()).subscribe((res: any) => {
      res.forEach((element: any) => {
        this.allPO.push(element);
        this.options3.push(element.status)
      });
    })
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
    this.myControl3.valueChanges.subscribe((res) => {
      // Exact match full ID 
      if (this.options3.find((obj) => { return obj === res; })) {
        if (this.allPO.find((po) => {
          if (po.status == res) {
            po.overall_limit = !this.found ? (parseFloat(po.overall_limit) + parseFloat(po.overall_limit_2) + parseFloat(po.overall_limit_3)).toString() : po.overall_limit
            this.found = true;
            this.selectedPO = po;
            this.postatus = this.selectedPO.invoice !== 'Pending' ? 'Al gestuurd/Déjà envoyé' : 'Nog niet behandeld/Pas encore traité'
          }
          return po === res;
        })) {

        }
        this.isID = true;
      }
      else {
        this.isID = false;
        this.selected_files = [];
      }
    });
    this.myControl3_multiple.valueChanges.subscribe((res) => {
      res.length > 0 ? this.isID = true : this.isID = false;
    })
  }

  onUserWantsOne() {
    this.wantsOne = true;
  }
  onUserWantsAll() {
    this.wantsAll = true;
  }

  private _filter3(value: string): string[] {
    const filterValue = value;
    return this.options3.filter(option => option.toString().includes(filterValue));
  }
  onFileSelected(event: any) {
    this.isFormValidWithFile = true;
    this.selected_files.push(...event.addedFiles);
  }
  onFileRemoved(event: any, i: number) {
    this.selected_files.splice(i, 1);
  }
  onSubmitDrag(u_ID: any) {
    const fd = new FormData();
    this.ref = this.selectedPO.id;
    fd.append('u_ID', u_ID);
    fd.append('u_ref', this.ref);
    fd.append('file', this.selected_files[0], this.selected_files[0].name);
    this.isBezig = true;
    this.doCountdown();
    this.sendVendors.sendInvoice(fd).subscribe((res) => {
      this.res = <Res>res;
      if (this.res.response === "250 Message received") {
        alert("Invoice naar AP gestuurd!")
        this.selected_files = [];
        this.u_ID = '';
        this.postatus = 'Net bijgewerkt / Modifications effectuées'
      }
      else {
        alert("Er ging iets mis.")
      }
      this.isBezig = false;
    });
  }
  onSubmitDragMultiple(selectedIDs: any) {
    const fd = new FormData();
    fd.append('u_IDs', selectedIDs);
    this.selected_files.forEach((file, index) => {
      fd.append(`file[${index}]`, file, file.name);
    });
    this.isBezig = true;
    this.doCountdown();
    alert("UNDER MAINTAINANCE! Come back later...")
    // this.sendVendors.sendInvoice(fd).subscribe((res) => {
    //   this.res = <Res>res;
    //   if (this.res.response === "250 Message received") {
    //     alert("Invoice naar AP gestuurd!")
    //     this.selected_files = [];
    //     this.u_ID = '';
    //     this.postatus = 'Net bijgewerkt / Modifications effectuées'
    //   }
    //   else {
    //     alert("Er ging iets mis.")
    //   }
    //   this.isBezig = false;
    // });
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
