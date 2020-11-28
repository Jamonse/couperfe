import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Customer } from 'src/app/authentication/model/customer.model';
import { LoadingService } from '../../loading/service/loading.service';
import { MessagesService } from '../../messages/service/messages.service';
import { CustomerResponse } from '../../model/customer.response';
import { CustomersService } from '../service/customers.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersStore {

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  count = 0;
  pageIndex = 0;
  pageSize = 0;
  sortBy: 'firstName' | 'lastName' | 'email';
  sortDirection: boolean = true;

  customers$: Observable<Customer[]> = this.customersSubject.asObservable();

  constructor(
    private customersService: CustomersService,
    private loadingService: LoadingService,
    private messagesService: MessagesService) 
  { 
    this.loadCustomers();
  }

  saveCustomer(customer: Customer)
  {
    if(customer.id == null || customer.id == 0)
    {
        return this.addCustomer(customer);
    }
    else
    {
        return this.updateCustomer(customer);
    }
  }

  private addCustomer(customer: Customer)
  {
    return this.customersService.addCustomer(customer).pipe(
      catchError(err => {
        if(err.status === 406)
        {
          this.messagesService.displayErrors(err.error.message);
        }
        return throwError(err);
      })
    )
  }

  private updateCustomer(customer: Customer)
  {
    return this.customersService.updateCustomer(customer).pipe(
      catchError(err => {
        if(err.status === 406)
        {
          this.messagesService.displayErrors(err.error.message);
        }
        return throwError(err);
      })
    )
  }

  loadCustomer(customerId): Observable<Customer>
  {
    return this.customersService.getCustomer(customerId);
  }

  loadCustomers(pageIndex = 0, pageSize = 5, sortBy?: 'firstName' | 'lastName' | 'email', asc?: boolean)
  {
    sortBy ?
      this.loadCustomersPagedAndSorted(pageIndex, pageSize, sortBy, asc) :
      this.loadComapniesPaged(pageIndex, pageSize);
  }

  private loadComapniesPaged(pageIndex: number, pageSize: number)
  {
    const loadedCustomers$ = this.customersService
    .getAllCustomersPaged(pageIndex, pageSize).pipe(
    catchError(err => {
        this.messagesService.displayErrors('Could not load companies');
        return throwError(err)
      }),
      tap((loadedCustomers: CustomerResponse) => {
          this.customersSubject.next(loadedCustomers.content);
          this.count = loadedCustomers.totalElements;
          this.pageIndex = pageIndex;
          this.pageSize = pageSize;
      })
    );
    this.loadingService.displayLoadingUntil(loadedCustomers$).subscribe();
  }

  private loadCustomersPagedAndSorted(pageIndex: number, pageSize: number, 
    sortBy: 'firstName' | 'lastName' | 'email', asc: boolean)
  {
    const loadedCustomers$ = this.customersService
    .getAllCustomerPagedAndSorted(pageIndex, pageSize, sortBy, asc).pipe(
    catchError(err => {
        this.messagesService.displayErrors('Could not load companies');
        return throwError(err)
      }),
      tap((loadedCustomers: CustomerResponse) => {
          this.customersSubject.next(loadedCustomers.content);
          this.count = loadedCustomers.totalElements;
          this.pageIndex = pageIndex;
          this.pageSize = pageSize;
          this.sortBy = sortBy;
          this.sortDirection = asc;
      })
    );
    this.loadingService.displayLoadingUntil(loadedCustomers$).subscribe();
  }

  loadSearchedCustomers(resultsCount: number = 5, nameExample: string)
  {
    return this.customersService.getAllCustomersByNameExample(resultsCount, nameExample).pipe(
      catchError(err => {
          return throwError(err)
      })
    );
  }

  deleteCustomer(customerId: number): Observable<any>
  {
    return this.customersService.deleteCustomer(customerId).pipe(
      catchError(err => {
          return throwError(err)
      })
    );
  }

}
