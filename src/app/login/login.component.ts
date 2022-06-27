import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js';  
import * as a from 'angular-animations';
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

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm)
  {
    const secret = CryptoJS.AES.encrypt(JSON.stringify(f.value),'nghimax').toString();
    console.log(secret);
    // console.log(CryptoJS.AES.decrypt(secret,'nghimax').toString(CryptoJS.enc.Utf8));
    

    this.isLoggedIn=true;
  }
}