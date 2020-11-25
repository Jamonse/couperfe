import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from 'src/app/authentication/model/customer.model';
import { CustomersService } from '../service/customers.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersStore {

  private customersSubject = new BehaviorSubject<Customer[]>([]);

  sortBy: 'firstName' | 'lastName' | 'email';
  sortDirection: boolean;

  customers$ = this.customersSubject.asObservable();

  constructor(private customersService: CustomersService) { }

  loadCustomers(pageIndex = 0, pageSize = 5, sortBy?: 'firstName' | 'lastName' | 'email', asc?: boolean)
  {
    
  }

  
}
