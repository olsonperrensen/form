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

  constructor(private router: Router, private authService: AuthService,
    private getData: GetdataService) { }

  ngOnInit(): void {
    this.getData.getServerStatus().subscribe(
      (res: any) => {
        console.log(`Home res:`)
        console.log(res)
        if (res.myMsg === "Hello world!") { console.log(res.myMsg); this.getData.setServerStatus(false) }
        else { console.log("Server didn't gave helloworld."); this.getData.setServerStatus(true) }
      }, (err) => {
        console.log(`Home err: ${err.body}`)
        this.getData.setServerStatus(true)
      }
    )
  }
  onSubmit(f: NgForm) {
    const secret = CryptoJS.AES.encrypt(JSON.stringify(f.value), 'h#H@k*Bjp3SrwdLM').toString();
    console.log(secret)
    this.authService.isAuthenticated({ usr: secret }).subscribe((res) => {
      console.log(res)
      if (res === true) {
        this.onLogin()
        this.isLoggedIn = true;

        setTimeout(() => {
          this.router.navigate(['/', 'homepage'])
        }, 2000);
      }
      else {
        this.onLogout()
        this.isLoggedIn = false;
        this.isInvalid = true;
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 2000);
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

}