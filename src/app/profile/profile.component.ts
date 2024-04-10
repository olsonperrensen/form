import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

import { Location } from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private authService: AuthService, private location: Location) {}
  myControl6 = new UntypedFormControl();
  isEditing = false;
  u_worker!: any;
  u_land!: any;
  u_merk!: any;
  u_email: any;
  ngOnInit(): void {
    this.u_worker = this.authService.getLocalStorageCredentials()[1];
    this.u_land = this.authService.getLocalStorageCredentials()[0];
    this.u_merk = this.authService.getLocalStorageCredentials()[2];
    this.u_email = this.u_worker.split(' ');
    this.u_email = `${this.u_email[0]}.${this.u_email[1]}@sbdinc.com`;
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
