import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/authentication/model/customer.model';

import { 
  CUSTOMER_DELETE_URL, 
  CUSTOMER_GET_ALL_URL, 
  CUSTOMER_GET_EXAMPLE_URL, 
  CUSTOMER_GET_PAGED_SORTED_URL, 
  CUSTOMER_GET_PAGED_URL, 
  CUSTOMER_GET_URL, 
  CUSTOMER_POST_URL, 
  CUSTOMER_PUT_URL, 
  NAME_EXAMPLE, 
  PAGE_INDEX,
  PAGE_SIZE,
  RESULTS_COUNT,
  SORT_DIRECTION,
  SORT_TYPE
} from '../../utils/api.utils';
import { CustomerSearchResult } from '../model/customer.search-result';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private httpClient: HttpClient) { }

  addCustomer(customer: Customer): Observable<Customer>
  {
    return this.httpClient.post<Customer>(CUSTOMER_POST_URL, customer);
  }

  getCustomer(customerId: number): Observable<Customer>
  {
    return this.httpClient.get<Customer>(CUSTOMER_GET_URL + customerId);
  }

  getAllCustomers(): Observable<Customer[]>
  {
    return this.httpClient.get<Customer[]>(CUSTOMER_GET_ALL_URL);
  }

  getAllCustomersPaged(pageIndex: number, pageSize: number): Observable<any>
  {
    const requestParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<Customer[]>(CUSTOMER_GET_PAGED_URL, {params: requestParams});
  }

  getAllCustomerPagedAndSorted(pageIndex: number, pageSize: number, 
    sortType: string, asc: boolean): Observable<any>
  {
    const requestParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortType)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<Customer[]>(CUSTOMER_GET_PAGED_SORTED_URL, {params: requestParams});
  }

  getAllCustomersByNameExample(resultsCount: number, nameExample: string): Observable<CustomerSearchResult[]>
  {
    const requestParams = new HttpParams()
      .set(RESULTS_COUNT, resultsCount.toString())
      .set(NAME_EXAMPLE, nameExample);
    return this.httpClient.get<CustomerSearchResult[]>(CUSTOMER_GET_EXAMPLE_URL, {params: requestParams});
  }

  updateCustomer(customer: Customer): Observable<any>
  {
    return this.httpClient.put(CUSTOMER_PUT_URL, customer);
  }

  deleteCustomer(customerId: number): Observable<any>
  {
    return this.httpClient.delete(CUSTOMER_DELETE_URL + customerId);
  }
  
}
