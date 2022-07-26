import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  u_id = 0;
  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void { 
    this.u_id = this.route.snapshot.queryParams['id'];
   }
  onSubmit(f: NgForm) {
    console.log(`Requesting from ID ${this.u_id}`)
    console.log(f.value.password)
    this.authService.resetPWD(this.u_id,f.value.password).subscribe((res)=>{

    })
  }
}
