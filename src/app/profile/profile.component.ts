import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as a from 'angular-animations';
import { Location } from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    a.fadeInLeftOnEnterAnimation()
  ]
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService,
    private location: Location) { }
  myControl6 = new FormControl();
  isEditing = false;
  u_worker = this.authService.getLocalStorageCredentials()[1]
  u_land = this.authService.getLocalStorageCredentials()[0]
  u_merk = this.authService.getLocalStorageCredentials()[2]
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
  goBack(): void {
    this.location.back();
  }
}
