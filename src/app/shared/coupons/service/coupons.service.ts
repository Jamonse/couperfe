import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CouponSearchResult } from '../model/coupon.search-result';
import { 
  COMPANY_COUPON_GET_ALL_URL, 
  COMPANY_COUPON_GET_EXAMPLE_URL, 
  COMPANY_COUPON_GET_PAGED_SORTED_URL, 
  COMPANY_COUPON_GET_PAGED_URL, 
  COMPANY_COUPON_GET_URL, 
  COUPON_DELETE_URL, 
  COUPON_GET_EXAMPLE_URL, 
  COUPON_GET_PAGED_SORTED_URL, 
  COUPON_GET_PAGED_URL, 
  COUPON_POST_URL, 
  COUPON_PUT_URL, 
  CUSTOMER_COUPON_GET_ALL_URL,
  CUSTOMER_COUPON_GET_EXAMPLE_URL,
  CUSTOMER_COUPON_GET_PAGED_URL,
  NAME_EXAMPLE,
  PAGE_INDEX,
  PAGE_SIZE,
  RESULTS_COUNT,
  SORT_DIRECTION,
  SORT_TYPE
} from '../../utils/api.utils';
import { Coupon } from '../model/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor(private httpClient: HttpClient) { }

  addCoupon(coupon: Coupon): Observable<Coupon>
  {
    return this.httpClient.post<Coupon>(COUPON_POST_URL, coupon);
  }

  updateCoupon(coupon: Coupon): Observable<any>
  {
    return this.httpClient.put(COUPON_PUT_URL, coupon);
  }

  getCompanyCoupon(couponId: number): Observable<Coupon>
  {
    return this.httpClient.get<Coupon>(COMPANY_COUPON_GET_URL + couponId)
  }

  getCompanyCoupons(): Observable<Coupon[]>
  {
    return this.httpClient.get<Coupon[]>(COMPANY_COUPON_GET_ALL_URL);
  }

  getCompanyCouponsPaged(pageIndex: number, pageSize: number): Observable<any>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<Coupon[]>(COMPANY_COUPON_GET_PAGED_URL, {params: queryParams});
  }

  getCompanyCouponsPagedAndSorted(pageIndex: number, pageSize: number, 
    sortBy: string, asc: boolean): Observable<any>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortBy)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<Coupon[]>(COMPANY_COUPON_GET_PAGED_SORTED_URL, {params: queryParams});
  }

  getCompanyCouponsByNameExample(resultsCount: number, nameExample: string): Observable<CouponSearchResult[]>
  {
    const queryParams = new HttpParams()
      .set(RESULTS_COUNT, resultsCount.toString())
      .set(NAME_EXAMPLE, nameExample);
    return this.httpClient.get<CouponSearchResult[]>(COMPANY_COUPON_GET_EXAMPLE_URL, {params: queryParams});
  }

  getCustomerCoupons(): Observable<Coupon[]>
  {
    return this.httpClient.get<Coupon[]>(CUSTOMER_COUPON_GET_ALL_URL);
  }

  getCustomerCouponsPaged(pageIndex: number, pageSize: number): Observable<Coupon[]>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<Coupon[]>(CUSTOMER_COUPON_GET_PAGED_URL, {params: queryParams});
  }

  getCustomerCouponsPagedSorted(pageIndex: number, pageSize: number,
    sortBy: string, asc: boolean): Observable<Coupon[]>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortBy)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<Coupon[]>(CUSTOMER_COUPON_GET_PAGED_URL, {params: queryParams});
  }

  getCustomerCouponsByNameExample(resultsCount: number, nameExample: string): Observable<CouponSearchResult[]>
  {
    const queryParams = new HttpParams()
      .set(RESULTS_COUNT, resultsCount.toString())
      .set(NAME_EXAMPLE, nameExample);
    return this.httpClient.get<CouponSearchResult[]>(CUSTOMER_COUPON_GET_EXAMPLE_URL, {params: queryParams});
  }

  getAllCouponsPaged(pageIndex: number, pageSize: number): Observable<Coupon[]>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<Coupon[]>(COUPON_GET_PAGED_URL, {params: queryParams});
  }

  getAllCouponsPagedAndSorted(pageIndex: number, pageSize: number,
    sortBy: string, asc: boolean): Observable<Coupon[]>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortBy)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<Coupon[]>(COUPON_GET_PAGED_SORTED_URL, {params: queryParams});
  }

  getAllCouponsByNameExample(resultsCount: number, nameExample: string): Observable<CouponSearchResult[]>
  {
    const queryParams = new HttpParams()
      .set(RESULTS_COUNT, resultsCount.toString())
      .set(NAME_EXAMPLE, nameExample);
    return this.httpClient.get<CouponSearchResult[]>(COUPON_GET_EXAMPLE_URL, {params: queryParams});
  }

  deleteCoupon(couponId: number): Observable<any>
  {
    return this.httpClient.delete(COUPON_DELETE_URL + couponId);
  }

}
