import { Component, Input, OnInit } from '@angular/core';
import { Coupon } from 'src/app/shared/coupons/model/coupon';

@Component({
  selector: 'app-cart-coupon',
  templateUrl: './cart-coupon.component.html',
  styleUrls: ['./cart-coupon.component.css']
})
export class CartCouponComponent implements OnInit {

  @Input()
  couponToDisplay: Coupon;

  constructor() { }

  ngOnInit(): void {
  }

}
