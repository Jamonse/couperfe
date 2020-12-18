import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { CouponDialogComponent } from 'src/app/company/coupon-dialog/coupon-dialog.component';
import { ClientType } from 'src/app/core/model/client-type';
import { PurchaseDialogComponent } from 'src/app/customer/purchase-dialog/purchase-dialog.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from '../../loading/service/loading.service';
import { WindowSizeService } from '../../service/window-size.service';
import { GlobalConfiguration } from '../../utils/common';
import { Coupon } from '../model/coupon';
import { ClientCouponsStore } from '../store/client-coupons.store';
import { ShopCouponStore } from '../store/coupons-shop.store';

@Component({
  selector: 'app-coupon-info',
  templateUrl: './coupon-info.component.html',
  styleUrls: ['./coupon-info.component.css']
})
export class CouponInfoComponent implements OnInit {

  COUPONS_URL = '../../';

  @Input()
  clientType: ClientType;

  couponToDisplay: Coupon;
  shopStore: ShopCouponStore;

  constructor(
    private couponsStore: ClientCouponsStore,
    private router: Router,
    private injector: Injector,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public windowService: WindowSizeService,
    public couponsShopStore: ShopCouponStore) 
    { 
      if(this.clientType == ClientType.CUSTOMER)
        {
          this.shopStore = this.injector.get<ShopCouponStore>(ShopCouponStore);
        }
    }

  ngOnInit(): void {
    const loadedCoupon$ = this.couponsStore.loadCoupon(
      this.clientType, 
      this.route.snapshot.params['id'])
      .pipe(
        tap(loadedCoupon => this.couponToDisplay = loadedCoupon),
        catchError(() => this.router.navigate([this.COUPONS_URL], {relativeTo: this.route})));
    this.loadingService.displayLoadingUntil(loadedCoupon$).subscribe();
  }

  purchaseCoupon()
  {
    const dialogConfig = {
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {coupons: [this.couponToDisplay]}}
    }

    let dialogRef = this.dialog.open(PurchaseDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if(res)
      {
        this.couponsStore.loadCoupons(ClientType.CUSTOMER);
        this.shopStore.loadCoupons();
        this.snackBar
          .open('Purchased Successfuly, Congatulations!', 'X', GlobalConfiguration.snackbarGlobalConfiguration())
        this.router.navigate([this.COUPONS_URL], {relativeTo: this.route, replaceUrl: true});
      }
    })
  }

  addToCard()
  {
    
  }

  updateCoupon()
  {
    const dialogConfig = { // Merge dialog config with data
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {dialogMode: 'update', coupon: this.couponToDisplay}}
    }

    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((updatedCoupon: Coupon) => {
      if(updatedCoupon)
      {
        this.couponToDisplay = updatedCoupon;
        this.snackBar
          .open(`${updatedCoupon.title} was updated successfuly!`, 'X', GlobalConfiguration.snackbarGlobalConfiguration());
        this.couponsStore.loadCoupons(ClientType.COMPANY);
      }
    })
  }

  deleteCoupon()
  {
    const dialogConfig = { // Merge dialog config with message
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {message: `Are you sure you want to delete ${this.couponToDisplay.title}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const couponDeleted$ = this.couponsStore.deleteCoupon(this.couponToDisplay.id);
        this.loadingService.displayLoadingUntil(couponDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${this.couponToDisplay.title} was deleted successfuly`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
            this.couponsStore.loadCoupons(ClientType.COMPANY);
            this.router.navigate([this.COUPONS_URL], {relativeTo: this.route, replaceUrl: true});
          }
        );
      }
    })
  }

  couponIncluded(coupon: Coupon, coupons: Coupon[])
  {
    return coupons.some(c => c.id == coupon.id);
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
