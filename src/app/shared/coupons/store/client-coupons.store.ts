import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { ClientType } from 'src/app/core/model/client-type';
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
export class ClientCouponsStore
{
    private couponsSubject = new BehaviorSubject<Coupon[]>([]);
    count = 0;
    pageIndex = 0;
    pageSize = 0;
    sortBy: CouponSortType
    sortDirection: boolean = true;
    
    clientType: ClientType;
    coupons$: Observable<Coupon[]> = this.couponsSubject.asObservable();

    constructor(
        private couponsService: CouponsService,
        private loadingService: LoadingService,
        private messagesService: MessagesService,
        private authService: AuthenticationService) 
    {   
        this.authService.clientType$.subscribe(clientType => {
            if(clientType && clientType != ClientType.ADMIN)
            {
                this.loadCoupons(clientType);
            }
            else
            {
                this.couponsSubject.next([]);
                this.sortBy = undefined;
            }
        });
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

    loadCoupon(clientType: ClientType, couponId: number): Observable<Coupon>
    {
        return this.couponsService.getClientCoupon(clientType, couponId).pipe(
            catchError(err => {
                if(err.status === 404)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        );
    }

    loadCoupons(clientType: ClientType, pageIndex = 0, pageSize = 5, sortBy?: CouponSortType, asc?: boolean)
    {
        sortBy ?
            this.loadCouponsPagedAndSorted(clientType, pageIndex, pageSize, sortBy, asc) :
            this.loadCouponsPaged(clientType, pageIndex, pageSize);
    }

    private loadCouponsPaged(clientType: ClientType, pageIndex: number, pageSize: number)
    {
        const loadedCoupons$ = this.couponsService
            .getClientCouponsPaged(clientType, pageIndex, pageSize).pipe(
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

    private loadCouponsPagedAndSorted(clientType: ClientType, pageIndex: number, pageSize: number, 
        sortBy: CouponSortType, asc: boolean)
    {
        const loadedCoupons$ = this.couponsService
            .getClientCouponsPagedAndSorted(clientType, pageIndex, pageSize, sortBy, asc).pipe(
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

    loadSearchedCoupons(clientType: ClientType, resultsCount: number = 5, nameExample: string): Observable<CouponSearchResult[]>
    {
        return this.couponsService.getClientCouponsByNameExample(
            clientType, resultsCount, nameExample).pipe(
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
                if(err.status === 400)
                {
                    this.messagesService.displayErrors(err.error.message);
                }
                return throwError(err);
            })
        );
    }

}