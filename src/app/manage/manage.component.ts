import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GetdataService } from '../getdata.service';
import { SendFormsService } from '../send-forms.service';
import * as a from 'angular-animations'

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
  filteredOptions2!: Observable<string[]>;
  options2 !: string[]
  u_klantnaam = ''
  u_new_klantnaam = ''
  isBackendDown = false;
  isKlant = false;
  isEditing = false;
  wantsToEdit = false;
  wantsToAdd = false;
  
  constructor(private getData:GetdataService, private sendForms:SendFormsService) { }

  ngOnInit(): void {
    this.options2 = []
    this.getData.getClients().subscribe((res:any)=>
    {
      this.options2 = res.sort()
      console.log("BackEnd is up! All good!");
    },(err)=>{
      this.isBackendDown = true;
    })

    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );
    this.myControl2.valueChanges.subscribe((res)=>{
      // Exact match full klant 
      if(this.options2.find((obj) => {this.u_new_klantnaam = obj; return obj.toLowerCase() === res.toLowerCase();}))
      {
        this.isKlant = true;
      }
      else
      {
        this.isKlant = false;
      }
    });

  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }

  onUserClick() {
    this.isEditing = true;
  }

  onUserAddClick() {
    this.getData.postClient(
      { new_client: `${this.u_new_klantnaam}` })
      .subscribe((res) => {this.checkRes(res)})
  }
  onUserEditClick() {
    // TO-FIX

    this.getData.updateClient(
      { old_client: `${this.u_klantnaam}`, new_client: `${this.u_new_klantnaam}`})
      .subscribe((res) => {this.checkRes(res)})
  }
  onUserDeleteClick() {
  // TO-FIX
    this.getData.delClient(
      {old_client: `${this.u_klantnaam}`})
      .subscribe((res) => {this.checkRes(res)})
  }

  onUserWantsToEdit() {
    this.wantsToEdit = true
  }
  onUserWantsToAdd() {
    this.wantsToAdd = true;
  }

  checkRes(res:any)
  {
    console.log(res)
    if (res == "500") {
      alert("Client could NOT be processed! Try again later.")
    }
    else if (res == "200") {
      alert("Client was successfully processed to the list!")
    }
  }
}
