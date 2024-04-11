import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GetdataService } from '../getdata.service';

const STATUSZERO = 'Request your Password';
const STATUSONE = 'Please wait';
const STATUSTWO = 'CHECK EMAIL';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent implements OnInit {
  pwdHelpTxt = STATUSZERO;
  isLoggedIn: boolean = false;
  isInvalid = false;
  u_username = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private getData: GetdataService
  ) {}

  ngOnInit(): void {
    document
      .getElementById('myVideo')
      ?.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
    this.getData.getServerStatus().subscribe(
      (res: any) => {
        if (res.myMsg === 'Hello world!') this.getData.setServerStatus(false);
        else this.getData.setServerStatus(true);
      },
      (err) => {
        this.getData.setServerStatus(true);
      }
    );
  }
  onSubmit(f: NgForm) {
    const secret = CryptoJS.AES.encrypt(
      JSON.stringify(f.value),
      'h#H@k*Bjp3SrwdLM'
    ).toString();
    this.authService.isAuthenticated({ usr: secret }).subscribe((res: any) => {
      if (res.u_user.isAuthenticated == true) {
        const token = res.token; // Extract the JWT token from the login response
        this.authService.setToken(token); // Store the JWT token in local storage
        this.onLogin();
        this.isLoggedIn = true;
        // Get autocomplete for POs
        this.authService.setCredentials(res.u_user);
        setTimeout(() => {
          this.router.navigate(['/', 'homepage']);
        }, 180);
      } else {
        this.onLogout();
        this.isLoggedIn = false;
        this.isInvalid = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 180);
      }
    });
  }

  onLogin() {
    this.authService.setGuardStatus(true);
    this.authService.login();
  }
  onLogout() {
    this.authService.logout();
  }

  onRecoverPWD(txt: string) {
    if (txt == STATUSONE || txt == STATUSTWO) {
      const element = document.querySelector(`#aresetLink`) as HTMLElement;
      if (element) {
        element.style.pointerEvents = 'none';
      }
      return;
    }
    if (this.u_username.endsWith('@sbdinc.com')) {
      this.pwdHelpTxt = 'Please wait';
      this.authService.recoverPWD(this.u_username).subscribe((res: any) => {
        if (res.response === '250 Message received') {
          this.pwdHelpTxt = STATUSTWO;
          alert(
            'Your password has been sent! Please, check your email for instructions.'
          );
        }
      });
    } else {
      alert(
        'You are not authorized to use this email provider. Please, use the official domain instead.'
      );
    }
  }
}
