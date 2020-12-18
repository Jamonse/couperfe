import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart$: Observable<Coupon[]>;

  constructor(
    private shopStore: ShopCouponStore
  ) 
  { 
    this.cart$ = this.shopStore.shoppingCart$;
  }

  ngOnInit(): void {
  }

}
