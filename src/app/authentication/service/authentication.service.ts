import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { 
  ADMIN_LOGIN_URL,
  COMPANY_LOGIN_URL,
  CUSTOMER_LOGIN_URL,
  COMPANY_LOAD_URL,
  CUSTOMER_LOAD_URL,
  AUTH_URL,
  API_URL
 } from 'src/app/shared/utils/api.utils';
import { AuthenticationResponse } from '../model/auth.response';

import { Client } from '../model/client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginSubject = new BehaviorSubject<boolean>(false);
  private logoutSubject = new BehaviorSubject<boolean>(false);
  private clientTypeSubject = new BehaviorSubject<ClientType>(null);
  private clientSubject = new BehaviorSubject<Client>(null);

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  
  clientType$: Observable<ClientType>;
  client$: Observable<Client>;

  constructor(
    private httpClient: HttpClient, 
    private router: Router,
    private loadingService: LoadingService)
  {
    this.isLoggedIn$ = this.loginSubject.asObservable();
    this.isLoggedOut$ = this.logoutSubject.asObservable();
    this.clientType$ = this.clientTypeSubject.asObservable();
    this.client$ = this.clientSubject.asObservable();
    
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
    let loginUrl = '';
    
    switch(clientType)
    { // Build the login url according to client type
      case ClientType.ADMIN:
        loginUrl = ADMIN_LOGIN_URL;
        break;
      case ClientType.COMPANY:
        loginUrl = COMPANY_LOGIN_URL;
        break;
      case ClientType.CUSTOMER:
        loginUrl = CUSTOMER_LOGIN_URL;
        break;
    }
    
    return this.httpClient.post<boolean>(loginUrl,{email, password})
        .pipe(tap(authenticated => {
          this.loginSubject.next(authenticated);
          this.logoutSubject.next(!authenticated);
          this.clientTypeSubject.next(clientType);
          this.loadUser(clientType);
        }));
  }

  // Return true if the user session is still alive (used for app refresh checks)
  isAuthenticated(): Observable<AuthenticationResponse>
  {
    return this.httpClient.get<AuthenticationResponse>(AUTH_URL).pipe(
      tap(authenticationReponse => {
        let clientType: ClientType;

        switch(authenticationReponse.clientType)
        {
          case 'Admin':
            clientType = ClientType.ADMIN;
            break;
          case 'Company':
            clientType = ClientType.COMPANY;
            this.loadUser(clientType);
            break;
          case 'Customer':
            this.loadUser(clientType);
            clientType = ClientType.CUSTOMER;
            break;
        }
        if(clientType)
        {
          this.clientTypeSubject.next(clientType);
        }
      })
    );
  }

  loadUser(clientType: ClientType)
  {
    const loadedUser$ = this.httpClient.get<Client>(API_URL + 
      clientType.toString().toLowerCase() + 
      '/getDetails').pipe(
        tap(loadedClient => this.clientSubject.next(loadedClient))
      );

    this.loadingService.displayLoadingUntil(loadedUser$).subscribe();
  }

  logout()
  {
    this.loginSubject.next(false);
    this.logoutSubject.next(true);
    this.clientTypeSubject.next(null);
    this.clientSubject.next(null);
  }
  
}
