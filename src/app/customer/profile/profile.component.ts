import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from 'src/app/authentication/model/customer.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  customerToDisplay$: Observable<Customer>;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.customerToDisplay$ = this.authService.client$.pipe(
      map((loadedCustomer: Customer) => loadedCustomer)
    );
  }

}
