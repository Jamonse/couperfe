import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { 
  ADMIN_LOGIN_URL,
  COMPANY_LOGIN_URL,
  CUSTOMER_LOGIN_URL,
  AUTH_URL,
  API_URL,
  LOGOUT_URL
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
    // Perform a login operation
    return this.httpClient.post<boolean>(loginUrl,{email, password})
        .pipe(tap(authenticated => {
          if(authenticated)
          { // Successful login
            this.loginSubject.next(authenticated);
            this.logoutSubject.next(!authenticated);
            this.clientTypeSubject.next(clientType);
            clientType != ClientType.ADMIN ?
              this.loadUser(clientType) : null;
          }
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
            clientType = ClientType.CUSTOMER;
            this.loadUser(clientType);
            break;
        }
        this.clientTypeSubject.next(clientType);
      })
    );
  }

  // Perofrms an client type authentication check, mainly used for auth guard
  isAllowed(clientType: ClientType): Observable<boolean>
  {
    if(this.clientTypeSubject.getValue() == clientType)
    {
      return of(true);
    }
    return this.isAuthenticated().pipe(
      tap(() => this.loadingService.displayLoading()),
      map(authResponse => authResponse.clientType == clientType),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  // Loads the current logged in user information
  loadUser(clientType: ClientType)
  {
    const loadedUser$ = this.httpClient.get<Client>(API_URL + 
      clientType.toString().toLowerCase() + 
      '/getDetails').pipe(
        tap(loadedClient => this.clientSubject.next(loadedClient))
      );

    this.loadingService.displayLoadingUntil(loadedUser$).subscribe();
  }

  clientType(): ClientType
  {
    return this.clientTypeSubject.getValue();
  }

  logout()
  { // Cleans the session and auth service state
    this.httpClient.post(LOGOUT_URL, '').subscribe(() => {
      this.loginSubject.next(false);
      this.logoutSubject.next(true);
      this.clientTypeSubject.next(null);
      this.clientSubject.next(null);
    });
  }
  
}
