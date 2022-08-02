import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { elementAt, map, startWith } from 'rxjs/operators';
import { GetdataService } from '../getdata.service';
import { SendFormsService } from '../send-forms.service';
import * as a from 'angular-animations'
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface SalesRep {
  id: string;
  username: string;
  password: string;
  naam: string;
  sbu: string;
  land: string;
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  animations:
    [a.fadeInLeftOnEnterAnimation(),
    a.bounceOutOnLeaveAnimation(),
    a.bounceOnEnterAnimation()]
})
export class ManageComponent implements OnInit {
  salesRepDetails !: SalesRep[];
  secret = false;
  myControl1 = new FormControl();
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl4 = new FormControl();
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  filteredOptions4!: Observable<string[]>;
  options2 !: string[];
  options3 !: string[];
  options4 !: string[];
  u_klantnaam = '';
  u_new_klantnaam = '';
  u_new_salesrep = '';
  u_new_email = '';
  u_new_pwd = ''
  u_new_sbu = ''
  u_new_land = ''
  u_ID = '';
  u_salesrep = '';
  isBackendDown = false;
  isKlant = false;
  isID = false;
  isSalesRep = false;
  isSalesRepEditing = false;
  isEditing = false;
  isPOEditing = false;
  isBezig = false;
  wantsToEdit = false;
  wantsToAdd = false;
  wantsToPO = false;
  wantsToSalesRep = false;
  askforSalesRepModification = false;
  s = 6;
  modify_counter = 0;

  constructor(private getData: GetdataService, private sendForms: SendFormsService, private router: Router) { }

  ngOnInit(): void {
    this.options2 = [];
    this.options3 = [];
    this.options4 = [];
    this.getData.getClients().subscribe((res: any) => {
      this.options2 = res.sort();
      console.log("BackEnd is up! All good!");
      if (this.options2.length < 2) {
        console.log(`Backend down: this.options2.length ${this.options2.length}`);
        this.isBackendDown = true;
      }
    }, (err: any) => {
      console.log(`Backend down: ${err}`)
      this.isBackendDown = true;
    });
    this.getData.getPO().subscribe((res: any) => {
      res.forEach((element: any) => {
        this.options3.push(element.id);
      });
    });
    this.getData.getSalesRep().subscribe((res: any) => {
      res.forEach((salesname: any) => {
        this.options4.push(salesname.naam)
      })
    })

    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => this._filter3(value)),
    );
    this.filteredOptions4 = this.myControl4.valueChanges.pipe(
      startWith(''),
      map(value => this._filter4(value)),
    );
    this.myControl1.valueChanges.subscribe((res) => {
      // Exact match full klant 
      if (res === "ME2800.") {
        this.secret = true;
      }
      else {
        this.secret = false;
      }
    });
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
    this.myControl4.valueChanges.subscribe((res) => {
      // Exact match fullname Sales Rep 
      if (this.options4.find((obj) => { return obj === res; })) {
        this.isSalesRep = true;
      }
      else {
        this.isSalesRep = false;
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
  private _filter4(value: string): string[] {
    const filterValue = value;
    return this.options4.filter(option => option.toLowerCase().includes(filterValue));
  }

  onUserClick() {
    this.isEditing = true;
  }
  onUserPOClick() {
    this.isPOEditing = true;
  }
  onUserSalesRepClick() {
    this.isSalesRepEditing = true;
    if (this.modify_counter % 2 === 0) {
      this.getData.getSalesRepDetails({ old_salesrep: `${this.u_salesrep}` }).subscribe((res: any) => {
        this.salesRepDetails = res;
        console.log(`fetches sales rep details: ${this.salesRepDetails}`)
      });
      this.askforSalesRepModification = true;
    }
    else {
      this.onUserSalesRepEditClick()
    }
    this.modify_counter++;
  }

  onUserAddClick() {
    this.u_new_klantnaam = this.u_new_klantnaam.replace(/[^a-zA-Z0-9\s]/gi, '');
    console.log(`New client cleansed ${this.u_new_klantnaam}`);
    if (this.u_new_klantnaam === "") {
      alert("Client cannot be empty! Use the right characters and try again.");
    }
    else {
      this.isBezig = true;
      this.doCountdown();
      this.getData.postClient(
        { new_client: `${this.u_new_klantnaam}` })
        .subscribe((res) => {
          this.checkRes(res);
          this.isBezig = false;
        })
    }

  }
  onUserEditClick() {
    this.u_new_klantnaam = this.u_new_klantnaam.replace(/[^a-zA-Z0-9\s]/gi, '');
    console.log(`Client edit cleansed ${this.u_new_klantnaam}`);
    if (this.u_new_klantnaam === "") {
      alert("Client cannot be empty! Use the right characters and try again.");
    }
    else {
      this.isBezig = true;
      this.doCountdown();
      this.getData.updateClient(
        { old_client: `${this.u_klantnaam}`, new_client: `${this.u_new_klantnaam}` })
        .subscribe((res) => {
          this.checkRes(res);
          this.isBezig = false;
          this.getData.getClients().subscribe((res: any) => {
            this.options2 = res.sort()
            console.log("BackEnd is up! All good!");
          }, (err: any) => {
            console.log(`Backend down: ${err}`)
            this.isBackendDown = true;
          });
        })
    }

  }
  onUserDeleteClick() {
    this.isBezig = true;
    this.doCountdown()
    this.getData.delClient(this.u_klantnaam)
      .subscribe((res) => {
        this.isBezig = false;
        this.checkRes(res);
      });

  }
  onUserPODeleteClick() {
    this.isBezig = true;
    this.doCountdown();
    this.getData.delPO({ u_ID: this.u_ID }).subscribe((res) => {
      this.isBezig = false;
      this.checkRes(res);
    })

  }
  onUserSalesRepDeleteClick() {
    if (this.modify_counter % 2 === 0) {
      this.getData.getSalesRepDetails({ old_salesrep: `${this.u_salesrep}` }).subscribe((res: any) => {
        this.salesRepDetails = res;
        console.log(`fetches sales rep details: ${this.salesRepDetails}`)
      });
      this.askforSalesRepModification = true;
    }
    else {
      this.onUserSalesRepDeleteConfirmClick()
    }
    this.modify_counter++;
  }
  onUserSalesRepDeleteConfirmClick() {
    this.isBezig = true;
    this.doCountdown();
    console.log(`Sent request to delete Sales Rep. ${this.u_salesrep}`)
    this.getData.delSalesRep({ u_salesrep: this.u_salesrep }).subscribe((res) => {
      this.isBezig = false;
      this.checkRes(res);
    })

  }
  onUserPOEditClick() {
    this.isBezig = true;
    this.doCountdown();
    this.getData.editPO({ u_ID: this.u_ID, new_client: `${this.u_new_klantnaam}` }).subscribe((res) => {
      this.isBezig = false;
      this.checkRes(res);
    })
  }
  onUserSalesRepEditClick() {
    this.u_new_salesrep = this.u_new_salesrep.replace(/[^a-zA-Z0-9\s]/gi, '');
    console.log(`Sales Rep edit cleansed ${this.u_new_salesrep}`);
    if (this.u_new_salesrep === "") {
      alert("Sales Rep. cannot be empty! Use the right characters and try again.");
    }
    else {
      this.isBezig = true;
      this.doCountdown();
      this.getData.updateSalesRep(
        {
          old_salesrep: `${this.u_salesrep}`,
          new_email: this.u_new_email,
          new_pwd: this.u_new_pwd,
          new_salesrep: `${this.u_new_salesrep}`,
          new_sbu: this.u_new_sbu,
          new_land: this.u_new_land
        })
        .subscribe((res) => {
          this.checkRes(res);
          this.isBezig = false;
        })
    }
  }
  onUserWantsToEdit() {
    this.wantsToEdit = true;
  }
  onUserWantsToAdd() {
    this.wantsToAdd = true;
  }
  onUserWantsToPO() {
    this.wantsToPO = true;
  }
  onUserWantsToSalesRep() {
    this.wantsToSalesRep = true;
  }

  checkRes(res: any) {
    console.log(res);
    if (res == "500") {
      alert("Client could NOT be processed! Try again later.");
    }
    else if (res == "200") {
      alert("Client was successfully processed to the list!");
      setTimeout(() => {
        this.u_klantnaam = ""
        this.u_new_klantnaam = ""
      }, 2888);
      this.toHome();
    }
  }

  doCountdown() {
    const myInterval = setInterval(() => {
      this.s--;
      if (this.s < 1) {
        clearInterval(myInterval); setTimeout(() => {
          this.s = 6;
        }, 3000);
      }
    }, 1000);
  }

  toHome() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 5111);
  }
}
