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


@NgModule({
  declarations: [
    ProfileComponent, 
    CouponsComponent, 
    ShopComponent, 
    CouponInfoComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    SharedModule,
    ScrollingModule
  ]
})
export class CustomerModule { }
