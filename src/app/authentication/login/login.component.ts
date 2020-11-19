import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  clientTypeHolder = ClientType;
  keys = Object.keys;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private loadingService: LoadingService
  ) 
  { 
    this.loginForm = formBuilder.group(
      {
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        clientType: ['', [Validators.required]]
      }
    )
  }

  ngOnInit(): void {
  }

  login()
  {
    if(this.loginForm.valid)
    { 
      const formContent = this.loginForm.value;
      let clientType: ClientType;

      switch(formContent.clientType)
      {
        case 'Admin':
          clientType = ClientType.ADMIN;
          break;
        case 'Comapny':
          clientType = ClientType.COMPANY;
          break;
        case 'Customer':
          clientType = ClientType.CUSTOMER;
          break;
      }

      const login$ = this.authService.login(formContent.email, formContent.password, clientType)
        .pipe(tap(authenticated => {
          if(authenticated)
          {
            this.router.navigateByUrl('');
          }
          else
          {
            alert('Error');
          }
        }), catchError(err => throwError(err))) //TODO change to custom message service
      
      this.loadingService.displayLoadingUntil(login$).subscribe();
      
    }
    
  }

}
