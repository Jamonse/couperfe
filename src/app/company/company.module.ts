import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../core/material/material.module';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import { CompanyCouponComponent } from './company-coupon/company-coupon.component';
import { CouponInfoComponent } from './coupon-info/coupon-info.component';


@NgModule({
  declarations: [ProfileComponent, CouponsComponent, CouponDialogComponent, CompanyCouponComponent, CouponInfoComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class CompanyModule { }
