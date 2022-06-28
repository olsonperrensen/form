import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.auth.isAuthenticated().then((authenticated) => {
      if(authenticated)
      {
        return true;
      } else {
        this.router.navigate(['/'])
        return false;
      }
    })
  }

  constructor(private auth:AuthService, private router:Router) { }
}
