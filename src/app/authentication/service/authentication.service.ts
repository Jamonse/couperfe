import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, filter, map, shareReplay, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

import { APIUtils } from 'src/app/shared/utils/api-utils';
import { Client } from '../model/client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Login URLs
  private ADMIN_LOGIN_URL = 'admin/login';
  private COMPANY_LOGIN_URL = 'company/login';
  private CUSTOMER_LOGIN_URL = 'customer/login';

  // Details Loading URLs
  private COMPANY_LOAD_URL = 'company/getDetials';
  private CUSTOMER_LOAD_URL = 'customer/getDetials';

  // Authentication URL
  private AUTH_KEY = 'authenticated';

  private loginSubject = new BehaviorSubject<boolean>(false);
  private logoutSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<Client>(null);

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  
  user$: Observable<Client>;

  constructor(
    private httpClient: HttpClient, 
    private router: Router,
    private loadingService: LoadingService)
  {
    this.isLoggedIn$ = this.loginSubject;
    this.isLoggedOut$ = this.logoutSubject;
    this.user$ = this.userSubject;
    
    /* 
    If the login url is reached (probaby pressing the browser back button)
    that action will be considered as a logout an wont allow to return to the app
    by pressing the forward button
    */ 
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => {
        if(event.url == '/login')
        {
          this.logout();
        }
      })
    ).subscribe()
  
  }

  login(email: string, password: string, clientType: ClientType): Observable<boolean>
  {
    let loginUrl = APIUtils.API_URL;

    switch(clientType)
    { // Build the login url according to client type
      case ClientType.ADMIN:
        loginUrl += this.ADMIN_LOGIN_URL;
        break;
      case ClientType.COMPANY:
        loginUrl += this.COMPANY_LOGIN_URL;
        break;
      case ClientType.CUSTOMER:
        loginUrl += this.CUSTOMER_LOGIN_URL;
        break;
    }

    return this.httpClient.post<boolean>(loginUrl,{email, password})
        .pipe(tap(authenticated => {
          this.loginSubject.next(authenticated);
          this.logoutSubject.next(!authenticated);
          this.loadUser(clientType);
        }));
  }

  loadUser(clientType: ClientType) 
  {
    let loadUrl = APIUtils.API_URL;

    switch(clientType)
    {
      case ClientType.ADMIN:
        return;
      case ClientType.COMPANY:
        loadUrl += this.COMPANY_LOAD_URL;
        break;
      case ClientType.CUSTOMER:
        loadUrl += this.CUSTOMER_LOAD_URL;
        break;
    }
    const clientLoad$ = this.httpClient.get<Client>(loadUrl)
      .pipe(tap(loadedClient => this.userSubject.next(loadedClient)));
    
    this.loadingService.displayLoadingUntil(clientLoad$).subscribe();
  }

  // Return true if the user session is still alive (used for app refresh checks)
  isAuthenticated(): Observable<boolean>
  {
    return this.httpClient.get<boolean>(APIUtils.API_URL + this.AUTH_KEY);
  }

  logout()
  {
    this.loginSubject.next(false);
    this.logoutSubject.next(true);
    this.userSubject.next(null);
  }
  
}
