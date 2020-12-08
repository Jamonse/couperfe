import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { MessagesService } from 'src/app/shared/messages/service/messages.service';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hidePassword: boolean = true;
  
  clientTypeHolder = ClientType;
  keys = Object.keys;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
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
        case 'Company':
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
            this.messagesService.displayErrors('Either email or password is invalid');
          }
        }));
      
      this.loadingService.displayLoadingUntil(login$).subscribe();
      
    }
    
  }

}
