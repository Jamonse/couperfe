import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ClientType } from 'src/app/core/model/client-type';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { GlobalConfiguration } from 'src/app/shared/utils/common';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart$: Observable<Coupon[]>;
  coupons: Coupon[];

  totalCoupons: number;
  totalPrice: number;

  constructor(
    private shopStore: ShopCouponStore,
    private clientCouponsStore: ClientCouponsStore,
    public windowService: WindowSizeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) 
  { 
    this.cart$ = this.shopStore.shoppingCart$;
    this.cart$.subscribe(coupons => {
      this.coupons = coupons
      this.totalCoupons = coupons.length;
      this.totalPrice = 
        coupons.reduce((totalPrice, currentCoupon) => totalPrice + currentCoupon.price, 0);
    })
  }

  ngOnInit(): void {
  }

  checkOut()
  {
    const dialogConfig = {
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {coupons: this.coupons}}
    }

    let dialogRef = this.dialog.open(PurchaseDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if(res)
      {
        this.shopStore.loadCart();
        this.shopStore.loadCoupons();
        this.clientCouponsStore.loadCoupons(ClientType.CUSTOMER);
        this.snackBar
          .open('Purchased Successfuly, Congatulations!', 'X', GlobalConfiguration.snackbarGlobalConfiguration())
      }
    })
  }

  removeCoupon(coupon: Coupon)
  {
    this.shopStore.removeFromCart(coupon);
  }

}
