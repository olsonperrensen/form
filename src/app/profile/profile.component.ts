import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }
  u_worker = this.authService.getCredentials().naam
  u_land = this.authService.getCredentials().land
  u_merk = this.authService.getCredentials().sbu
  u_email: any
  ngOnInit(): void {
    this.u_email = this.u_worker.split(" ")
    this.u_email = `${this.u_email[0]}.${this.u_email[1]}@sbdinc.com`
  }

}
