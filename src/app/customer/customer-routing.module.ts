import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponInfoComponent } from './coupon-info/coupon-info.component';
import { CouponsComponent } from './coupons/coupons.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopComponent } from './shop/shop.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'my-coupons', children: [
        {path: '', component: CouponsComponent},
        {path: 'info/:id', component: CouponInfoComponent}
      ]},
      {path: 'shop', component: ShopComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
