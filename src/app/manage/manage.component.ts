import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GetdataService } from '../getdata.service';
import { SendFormsService } from '../send-forms.service';
import * as a from 'angular-animations'
import { Router } from '@angular/router';

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
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  options2 !: string[]
  options3 !: string[]
  u_klantnaam = ''
  u_new_klantnaam = ''
  u_emailID = ''
  isBackendDown = false;
  isKlant = false;
  isEmailID = false;
  isEditing = false;
  isPOEditing = false;
  isBezig = false;
  wantsToEdit = false;
  wantsToAdd = false;
  wantsToPO = false;
  s = 6

  constructor(private getData: GetdataService, private sendForms: SendFormsService, private router:Router) { }

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
    this.getData.getPO().subscribe((res:any)=>{
      res.forEach((element: any) => {
        this.options3.push(element.external_id)
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
      // Exact match full emailID 
      if (this.options3.find((obj) => { return obj.toLowerCase() === res.toLowerCase(); })) {
        this.isEmailID = true;
      }
      else {
        this.isEmailID = false;
      }
    });

  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filter3(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options3.filter(option => option.toLowerCase().includes(filterValue));
  }

  onUserClick() {
    this.isEditing = true;
  }
  onUserPOClick() {
    this.isPOEditing = true;
  }

  onUserAddClick() {
    this.u_new_klantnaam = this.u_new_klantnaam.replace(/[^a-zA-Z0-9\s]/gi, '');
    console.log(`New client cleansed ${this.u_new_klantnaam}`)
    if(this.u_new_klantnaam === "")
    {
      alert("Client cannot be empty! Use the right characters and try again.")
    }
    else
    {
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
    console.log(`Client edit cleansed ${this.u_new_klantnaam}`)
    if(this.u_new_klantnaam === "")
    {
      alert("Client cannot be empty! Use the right characters and try again.")
    }
    else{
      this.isBezig = true;
      this.doCountdown()
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
  onUserPODeleteClick()
  {

  }
onUserPOEditClick()
{

}
  onUserWantsToEdit() {
    this.wantsToEdit = true
  }
  onUserWantsToAdd() {
    this.wantsToAdd = true;
  }
  onUserWantsToPO(){
    this.wantsToPO = true;
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

  toHome(){
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 5111);
  }
}
