import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, skipWhile, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    return this.isAuthorized(next).pipe(tap(allowed => {
      if(!allowed)
      {
        this.router.navigate(['home']);
      }
    }));
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean 
  {
    return this.isAuthorized(route).pipe(tap(allowed => {
      if(!allowed)
      {
        this.router.navigate(['home']);
      }
    }));
  }

    isAuthorized(route: ActivatedRouteSnapshot | Route): Observable<boolean>
    {
      let roles: Array<ClientType> = route.data.roles;
      return this.authService.isAllowed(roles[0]);
    }
  
}
