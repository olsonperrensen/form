import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      if(this.auth.getGuardStatus())
      {
        return true;
      } else {
        this.router.navigate(['/'])
        return false;
      }
  }

  constructor(private auth:AuthService, private router:Router) { }
}
