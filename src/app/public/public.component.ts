import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import * as a from 'angular-animations';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
  animations: [
    a.bounceInLeftOnEnterAnimation(),
    a.bounceInRightOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.flipOnEnterAnimation(),
  ]
})
export class PublicComponent implements OnInit {

  isLoggedIn: boolean = false;
  isInvalid = false;
  u_username = ""

  constructor(private router: Router, private authService: AuthService,
    private getData: GetdataService) { }

  ngOnInit(): void {
    this.getData.getServerStatus().subscribe(
      (res: any) => {
        if (res.myMsg === "Hello world!") this.getData.setServerStatus(false)
        else this.getData.setServerStatus(true)
      }, (err) => {
        this.getData.setServerStatus(true)
      }
    )
  }
  onSubmit(f: NgForm) {
    const secret = CryptoJS.AES.encrypt(JSON.stringify(f.value), 'h#H@k*Bjp3SrwdLM').toString();
    this.authService.isAuthenticated({ usr: secret }).subscribe((res: any) => {
      if (res.u_user.isAuthenticated == true) {
        const token = res.token; // Extract the JWT token from the login response
        this.authService.setToken(token); // Store the JWT token in local storage
        this.onLogin()
        this.isLoggedIn = true;
        // Get autocomplete for POs
        this.authService.setCredentials(res.u_user);
        setTimeout(() => {
          this.router.navigate(['/', 'homepage'])
        }, 180);
      }
      else {
        this.onLogout()
        this.isLoggedIn = false;
        this.isInvalid = true;
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 180);
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

  onRecoverPWD() {
    if (this.u_username.endsWith('@sbdinc.com')) {
      this.authService.recoverPWD(this.u_username).subscribe((res: any) => {
        if (res.response === "250 Message received") {
          alert("Your password has been sent! Please, check your email for instructions.")
        }
      });
    }
    else {
      alert("You are not authorized to use this email provider. Please, use the official domain instead.")
    }
  }
}