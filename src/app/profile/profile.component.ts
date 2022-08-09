import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as a from 'angular-animations';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    a.fadeInLeftOnEnterAnimation()
  ]
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }
  myControl6 = new FormControl();
  isEditing = false;
  u_worker = this.authService.getCredentials().naam
  u_land = this.authService.getCredentials().land
  u_merk = this.authService.getCredentials().sbu
  u_email: any
  ngOnInit(): void {
    this.u_email = this.u_worker.split(" ")
    this.u_email = `${this.u_email[0]}.${this.u_email[1]}@sbdinc.com`
  }
  onUserEdit() {
    this.isEditing = !this.isEditing;
  }
  onUserApply() {
    this.isEditing = !this.isEditing;
    // TO-DO
  }
}