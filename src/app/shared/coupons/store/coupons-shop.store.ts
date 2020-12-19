import { Injectable } from '@angular/core';
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
export class ShopCouponStore
{
    private couponsSubject = new BehaviorSubject<Coupon[]>([]);
    private shoppingCartSubject = new BehaviorSubject<Coupon[]>([]);
    count = 0;
    pageIndex = 0;
    pageSize = 0;
    sortBy: CouponSortType;
    sortDirection: boolean = true;

    coupons$ = this.couponsSubject.asObservable();
    shoppingCart$ = this.shoppingCartSubject.asObservable();

    constructor(
        private couponsService: CouponsService,
        private messagesService: MessagesService,
        private loadingService: LoadingService,
        private authService: AuthenticationService) 
    { 
        this.authService.clientType$.subscribe(clientType => {
            if(clientType && clientType == ClientType.CUSTOMER)
            {
                this.loadCoupons();
                this.loadCart();
            }
        })    
    }

    loadCoupons(pageIndex = 0, pageSize = 5, sortBy?: CouponSortType, asc?: boolean)
    {
        sortBy ?
            this.loadCouponsPagedAndSorted(pageIndex, pageSize, sortBy, asc) :
            this.loadCouponsPaged(pageIndex, pageSize);
    }

    purchaseCoupons(coupons: Coupon[])
    {
        return this.couponsService.purchaseCoupons(coupons).pipe(
            catchError(this.displayErrors)
        );
    }

    addToCart(coupon: Coupon)
    {
        const addedCoupon$ = this.couponsService.addToCart(coupon).pipe(
            catchError(this.displayErrors)
        );
        this.loadingService.displayLoadingUntil(addedCoupon$).subscribe(() => {
            const cart = this.shoppingCartSubject.getValue();
            cart.push(coupon);
            this.shoppingCartSubject.next(cart);
        })
    }

    removeFromCart(coupon: Coupon)
    {
        const removedCoupon$ = this.couponsService.removeFromCart(coupon).pipe(
            catchError(this.displayErrors)
        );
        this.loadingService.displayLoadingUntil(removedCoupon$).subscribe(() => {
            const cart = this.shoppingCartSubject.getValue();
            let index = cart.indexOf(coupon);
            cart.splice(index, 1);
            this.shoppingCartSubject.next(cart);
        })
    }

    loadCart()
    {
        const loadedCart$ = this.couponsService.getCart().pipe(
            catchError(err => {
                this.messagesService.displayErrors('Could not load coupons');
                return throwError(err);
            })
        );
        this.loadingService.displayLoadingUntil(loadedCart$).subscribe((loadedCart: Coupon[]) => 
            this.shoppingCartSubject.next(loadedCart)
        )
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

    private displayErrors = (err) =>
    {
        this.messagesService.displayErrors(err.error.message);
        return throwError(err);
    }
}