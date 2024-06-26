import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  
})
export class ResetComponent implements OnInit {

  u_id = 0;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.u_id = this.route.snapshot.queryParams['id'];
  }
  onSubmit(f: NgForm) {
    f.value.password.length >= 4 ? this.authService.resetPWD(this.u_id, f.value.password).subscribe((res: any) => {
      if (res.status == 200) {
        alert("Password has been successfully changed! You can now log in.");
        this.router.navigate(['/']);
      }
      else if (res.status == 500) {
        alert("ERROR. Password could NOT be changed!")
      }
      else {
        alert("Something unexpected occurred. Contact students.benelux@sbdinc.com for further assistance.")
      }
    }) : alert("Password must be at least 4 characters long.");
  }
}
