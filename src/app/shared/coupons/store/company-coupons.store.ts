import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { LoadingService } from '../../loading/service/loading.service';
import { MessagesService } from '../../messages/service/messages.service';
import { Coupon } from '../model/coupon';
import { CouponResponse } from '../model/coupon.response';
import { CouponSearchResult } from '../model/coupon.search-result';
import { CouponsService } from '../service/coupons.service';
import { CouponSortType } from '../utils/coupon.sort-type';

@Injectable({
    providedIn: 'root'
})
export class CompanyCouponsStore
{
    private couponsSubject = new BehaviorSubject<Coupon[]>([]);
    count = 0;
    pageIndex = 0;
    pageSize = 0;
    sortBy: CouponSortType
    sortDirection: boolean = true;
    coupons$: Observable<Coupon[]> = this.couponsSubject.asObservable();

    constructor(
        private couponsService: CouponsService,
        private loadingService: LoadingService,
        private messagesService: MessagesService) 
    { 
        this.loadCoupons();
    }

    saveCoupon(coupon: Coupon): Observable<Coupon>
    {
        if(coupon.id == null || coupon.id == 0)
        {
            return this.addCoupon(coupon);
        }
        else
        {
            return this.updateCoupon(coupon);
        }
    }
    
    private addCoupon(coupon: Coupon)
    {
        return this.couponsService.addCoupon(coupon).pipe(
            catchError(err => {
                if(err.status === 406 || 400)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        )
    }

    private updateCoupon(coupon: Coupon)
    {
        return this.couponsService.updateCoupon(coupon).pipe(
            catchError(err => {
                if(err.status === 406 || 400)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        )
    }

    loadCoupon(couponId: number): Observable<Coupon>
    {
        return this.couponsService.getCompanyCoupon(couponId).pipe(
            catchError(err => {
                if(err.status === 404)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        );
    }

    loadCoupons(pageIndex = 0, pageSize = 5, sortBy?: CouponSortType, asc?: boolean)
    {
        sortBy ?
            this.loadCouponsPagedAndSorted(pageIndex, pageSize, sortBy, asc) :
            this.loadCouponsPaged(pageIndex, pageSize);
    }

    private loadCouponsPaged(pageIndex: number, pageSize: number)
    {
        const loadedCoupons$ = this.couponsService
            .getCompanyCouponsPaged(pageIndex, pageSize).pipe(
                catchError(err => {
                    this.messagesService.displayErrors('Could not load coupons');
                    return throwError(err);
                }),
                tap((loadedCoupons: CouponResponse) => {
                    this.couponsSubject.next(loadedCoupons.content);
                    this.count = loadedCoupons.totalElements;
                    this.pageIndex = pageIndex;
                    this.pageSize = pageSize;
                })
        );
        this.loadingService.displayLoadingUntil(loadedCoupons$).subscribe();
    }

    private loadCouponsPagedAndSorted(pageIndex: number, pageSize: number, 
        sortBy: CouponSortType, asc: boolean)
    {
        const loadedCoupons$ = this.couponsService
            .getCompanyCouponsPagedAndSorted(pageIndex, pageSize, sortBy, asc).pipe(
                catchError(err => {
                    this.messagesService.displayErrors('Could not load coupons');
                    return throwError(err);
                }),
                tap((loadedCoupons: CouponResponse) => {
                    this.couponsSubject.next(loadedCoupons.content);
                    this.count = loadedCoupons.totalElements;
                    this.pageIndex = pageIndex;
                    this.pageSize = pageSize;
                    this.sortBy = sortBy;
                    this.sortDirection = asc;
                })
        );
        this.loadingService.displayLoadingUntil(loadedCoupons$).subscribe();
    }

    loadSearchedCoupons(resultsCount: number = 5, nameExample: string): Observable<CouponSearchResult[]>
    {
        return this.couponsService.getCompanyCouponsByNameExample(
            resultsCount, nameExample).pipe(
                retry(3),
                catchError(err => {
                    return throwError(err);
                })
            );
    }

    deleteCoupon(couponId: number): Observable<any>
    {
        return this.couponsService.deleteCoupon(couponId).pipe(
            catchError(err => {
                return throwError(err);
            })
        );
    }
}