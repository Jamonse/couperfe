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
  CUSTOMER_CATEGORY_GET_ALL_URL,
  CUSTOMER_COUPON_GET_URL,
  CUSTOMER_COUPON_GET_EXAMPLE_URL,
  CUSTOMER_COUPON_GET_PAGED_SORTED_URL,
  CUSTOMER_COUPON_GET_PAGED_URL,
  NAME_EXAMPLE,
  PAGE_INDEX,
  PAGE_SIZE,
  RESULTS_COUNT,
  SORT_DIRECTION,
  SORT_TYPE,
  COUPON_PURCHASE_URL
} from '../../utils/api.utils';
import { Coupon } from '../model/coupon';
import { ClientType } from 'src/app/core/model/client-type';
import { CouponResponse } from '../model/coupon.response';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor(private httpClient: HttpClient) { }

  addCoupon(coupon: Coupon): Observable<Coupon>
  {
    return this.httpClient.post<Coupon>(COUPON_POST_URL, coupon);
  }

  purchaseCoupons(coupons: Coupon[]): Observable<any>
  {
    return this.httpClient.post(COUPON_PURCHASE_URL, coupons);
  }

  updateCoupon(coupon: Coupon): Observable<any>
  {
    return this.httpClient.put(COUPON_PUT_URL, coupon);
  }

  getClientCoupon(clientType: ClientType, couponId: number): Observable<Coupon>
  {
    let url;
    if(clientType && clientType == ClientType.COMPANY)
    {
      url = COMPANY_COUPON_GET_URL;
    }
    else if(clientType && clientType == ClientType.CUSTOMER)
    {
      url = CUSTOMER_COUPON_GET_URL;
    }
    return this.httpClient.get<Coupon>(COMPANY_COUPON_GET_URL + couponId)
  }

  getClientCoupons(clientType: ClientType): Observable<Coupon[]>
  {
    let url;
    if(clientType && clientType == ClientType.COMPANY)
    {
      url = COMPANY_COUPON_GET_ALL_URL;
    }
    else if(clientType && clientType == ClientType.CUSTOMER)
    {
      url = CUSTOMER_CATEGORY_GET_ALL_URL;
    }
    return this.httpClient.get<Coupon[]>(url);
  }

  getClientCouponsPaged(clientType: ClientType, pageIndex: number, pageSize: number): Observable<CouponResponse>
  {
    let url;
    if(clientType && clientType == ClientType.COMPANY)
    {
      url = COMPANY_COUPON_GET_PAGED_URL;
    }
    else if(clientType && clientType == ClientType.CUSTOMER)
    {
      url = CUSTOMER_COUPON_GET_PAGED_URL;
    }
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<CouponResponse>(url, {params: queryParams});
  }

  getClientCouponsPagedAndSorted(clientType: ClientType, pageIndex: number, pageSize: number, 
    sortBy: string, asc: boolean): Observable<CouponResponse>
  {
    let url;
    if(clientType && clientType == ClientType.COMPANY)
    {
      url = COMPANY_COUPON_GET_PAGED_SORTED_URL;
    }
    else if(clientType && clientType == ClientType.CUSTOMER)
    {
      url = CUSTOMER_COUPON_GET_PAGED_SORTED_URL;
    }
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortBy)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<CouponResponse>(url, {params: queryParams});
  }

  getClientCouponsByNameExample(clientType: ClientType, resultsCount: number, nameExample: string): Observable<CouponSearchResult[]>
  {
    let url;
    if(clientType && clientType == ClientType.COMPANY)
    {
      url = COMPANY_COUPON_GET_EXAMPLE_URL;
    }
    else if(clientType && clientType == ClientType.CUSTOMER)
    {
      url = CUSTOMER_COUPON_GET_EXAMPLE_URL;
    }
    console.log(url)
    const queryParams = new HttpParams()
      .set(RESULTS_COUNT, resultsCount.toString())
      .set(NAME_EXAMPLE, nameExample);
    return this.httpClient.get<CouponSearchResult[]>(url, {params: queryParams});
  }

  getAllCouponsPaged(pageIndex: number, pageSize: number): Observable<CouponResponse>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString());
    return this.httpClient.get<CouponResponse>(COUPON_GET_PAGED_URL, {params: queryParams});
  }

  getAllCouponsPagedAndSorted(pageIndex: number, pageSize: number,
    sortBy: string, asc: boolean): Observable<CouponResponse>
  {
    const queryParams = new HttpParams()
      .set(PAGE_INDEX, pageIndex.toString())
      .set(PAGE_SIZE, pageSize.toString())
      .set(SORT_TYPE, sortBy)
      .set(SORT_DIRECTION, String(asc));
    return this.httpClient.get<CouponResponse>(COUPON_GET_PAGED_SORTED_URL, {params: queryParams});
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
