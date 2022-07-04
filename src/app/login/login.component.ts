import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js';  
import * as a from 'angular-animations';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations:[
    a.bounceInLeftOnEnterAnimation(),
    a.bounceInRightOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.flipOnEnterAnimation(),
  ]
})
export class LoginComponent implements OnInit {

  isLoggedIn:boolean=false;
  isInvalid = false;

  constructor(private router:Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm)
  {
    const secret = CryptoJS.AES.encrypt(JSON.stringify(f.value),'h#H@k*Bjp3SrwdLM').toString();
    this.authService.isAuthenticated(secret).subscribe((res)=>{
      if(res===true)
      {
        this.onLogin()
      this.isLoggedIn=true;

      setTimeout(() => {
        this.router.navigate(['/','manage'])
      }, 2000);
      }
      else
      {
        this.onLogout()
        this.isLoggedIn=false;
        this.isInvalid = true;
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
      }
    })
  }

  onLogin()
  {
    this.authService.login()
  }
  onLogout()
  {
    this.authService.logout()
  }

}