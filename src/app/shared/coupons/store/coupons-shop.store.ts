import { Injectable } from '@angular/core';
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
export class ShopCouponStore
{
    private couponsSubject = new BehaviorSubject<Coupon[]>([]);
    count = 0;
    pageIndex = 0;
    pageSize = 0;
    sortBy: CouponSortType;
    sortDirection: boolean = true;

    coupons$ = this.couponsSubject.asObservable();

    constructor(
        private couponsService: CouponsService,
        private messagesService: MessagesService,
        private loadingService: LoadingService) 
    { 
        this.loadCoupons();
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
            .getAllCouponsPaged(pageIndex, pageSize).pipe(
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

    private loadCouponsPagedAndSorted(pageIndex: number, pageSize: number, sortBy: CouponSortType, sortDirection: boolean)
    {
        const loadedCoupons$ = this.couponsService
            .getAllCouponsPagedAndSorted(pageIndex, pageSize, sortBy, sortDirection).pipe(
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
                this.sortDirection = sortDirection;
            })
        );
        this.loadingService.displayLoadingUntil(loadedCoupons$).subscribe();
    }

    loadSearchedCoupons(resultsCount: number = 5, nameExample: string): Observable<CouponSearchResult[]>
    {
        return this.couponsService.getAllCouponsByNameExample(
            resultsCount, nameExample).pipe(
                retry(3),
                catchError(err => {
                    return throwError(err);
                })
            );
    }
}