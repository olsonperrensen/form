import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import * as a from 'angular-animations';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    a.bounceInLeftOnEnterAnimation(),
    a.bounceInRightOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.flipOnEnterAnimation(),
  ]
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean = false;
  isInvalid = false;

  constructor(private router: Router, private authService: AuthService, private location: Location) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    const secret = CryptoJS.AES.encrypt(JSON.stringify(f.value), 'h#H@k*Bjp3SrwdLM').toString();
    this.authService.isAuthenticated({ usr: secret }).subscribe((res: any) => {
      if (res.u_user.isAuthenticated === true) {
        const token = res.token; // Extract the JWT token from the login response
        this.authService.setToken(token); // Store the JWT token in local storage
        this.onLogin()
        this.isLoggedIn = true;

        setTimeout(() => {
          this.router.navigate(['/', 'manage'])
        }, 1200);
      }
      else {
        this.onLogout()
        this.isLoggedIn = false;
        this.isInvalid = true;
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 1200);
      }
    })
  }

  onLogin() {
    this.authService.setGuardStatus(true)
    this.authService.login()
  }
  onLogout() {
    this.authService.logout()
  }
  goBack(): void {
    this.location.back();
  }
}
