import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as a from 'angular-animations';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [
    a.bounceInLeftOnEnterAnimation(),
    a.bounceInRightOnEnterAnimation(),
    a.fadeInOnEnterAnimation(),
    a.flipOnEnterAnimation(),
  ]
})
export class ResetComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }
  onSubmit(f: NgForm) {
    console.log(f.value)
    this.authService.resetPWD(f.value.password).subscribe((res)=>{
      
    })
  }
}
