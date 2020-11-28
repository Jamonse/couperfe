import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../core/material/material.module';


@NgModule({
  declarations: [ProfileComponent, CouponsComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class CompanyModule { }
