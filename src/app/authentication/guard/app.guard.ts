import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {

  constructor(private router: Router, 
    private authService: AuthenticationService,
    private loadingService: LoadingService) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    return this.authService.isLoggedIn$.pipe(map(loggedIn => {

      if(!loggedIn)
      { // User is not logged in (as per the authentication service)
        this.authService.isLoggedOut$.pipe(tap(loggedOut => {
          if(loggedOut)
          { // The user is logged out (wont be able to reconnect by pressing the back button)
            this.navigateToLoginPage();
            return false;
          }
        })).subscribe()

        const authenticated$ = this.authService.isAuthenticated().pipe(
          tap(authenticated => {
            // Checks wether the user is still logged in (session is still alive)
            if(!authenticated)
            {
              this.navigateToLoginPage();
              return false;
            }
            return true;
          }), // Connection Error
          catchError(err => {
            this.navigateToLoginPage();
            return of(false);
          }));

        this.loadingService.displayLoadingUntil(authenticated$).subscribe();
      }
      return true;
    }))
  }

  private navigateToLoginPage()
  {
    this.router.navigateByUrl('/login');
  }
}
