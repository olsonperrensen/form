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

  onUserClick()
  {
    this.isEditing = true;
  }

  onUserEditClick()
  {
    this.getData.postClient({old_client:`${this.u_klantnaam}`,new_client:`${this.u_new_klantnaam}`,reason:"EDIT"}).subscribe((res)=>{
      if(res !== "ERROR_WHILE_EDITING")
      {
        alert("Edit successfully placed!")
      }
    },(err)=>{
      alert("Something went wrong while editing the client... Try again.")
    })
  }
  onUserAddClick()
  {
    this.getData.postClient({old_client:`${this.u_klantnaam}`,new_client:`${this.u_new_klantnaam}`,reason:"ADD"}).subscribe((res)=>{
      if(res !== "ERROR_WHILE_ADDING")
      {
        alert("Client successfully added!")
      }
    },(err)=>{
      alert("Something went wrong while adding the client... Try again.")
    })
  }
  onUserDeleteClick()
  {
    this.getData.postClient({old_client:`${this.u_klantnaam}`,reason:"DELETE"}).subscribe((res)=>{
      if(res !== "ERROR_WHILE_DELETING")
      {
        alert("Client successfully deleted!")
      }
    },(err)=>{
      alert("Something went wrong while deleting the client... Try again.")
    })
  }

  onUserWantsToEdit()
  {
    this.wantsToEdit =  true
  }
  onUserWantsToAdd()
  {
    this.wantsToAdd = true;
  }

}
