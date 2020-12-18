import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CouponsComponent } from './coupons/coupons.component';
import { ShopComponent } from './shop/shop.component';
import { CouponInfoComponent } from './coupon-info/coupon-info.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../core/material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CouponShopInfoComponent } from './coupon-shop-info/coupon-shop-info.component';
import { CartComponent } from './cart/cart.component';
import { CartCouponComponent } from './cart-coupon/cart-coupon.component';


@NgModule({
  declarations: [
    ProfileComponent, 
    CouponsComponent, 
    ShopComponent, 
    CouponInfoComponent, PurchaseDialogComponent, CouponShopInfoComponent, CartComponent, CartCouponComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    SharedModule,
    ScrollingModule,
    MatStepperModule
  ]
})
export class CustomerModule { }
