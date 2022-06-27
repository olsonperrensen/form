import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  [a.fadeInLeftOnEnterAnimation()]
})
export class ManageComponent implements OnInit {
  myControl2 = new FormControl();
  filteredOptions2!: Observable<string[]>;
  options2 !: string[]
  u_klantnaam = ''
  isBackendDown = false;
  
  constructor(private getData:GetdataService, private sendForms:SendFormsService) { }

  ngOnInit(): void {
    this.options2 = []
    this.getData.getClients().subscribe((res:any)=>
    {
      this.options2 = res.sort()
      if(this.options2.length < 1)
      {
        setTimeout(() => {
          this.isBackendDown = true;
        }, 3800);
        setTimeout(() => {
          this.isBackendDown = false;
        }, 6300);
      }
      else
      {
        console.log("BackEnd is up! All good!");
      }
    })

    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );

  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }

}
