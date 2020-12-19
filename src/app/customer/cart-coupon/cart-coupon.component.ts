import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Coupon } from 'src/app/shared/coupons/model/coupon';

@Component({
  selector: 'app-cart-coupon',
  templateUrl: './cart-coupon.component.html',
  styleUrls: ['./cart-coupon.component.css']
})
export class CartCouponComponent implements OnInit {

  @Input()
  couponToDisplay: Coupon;

  @Output()
  removeCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

  constructor() { }

  ngOnInit(): void {
  }

  styleCoupon()
  {
    const couponStyles = {
      'background': 'linear-gradient(to left, rgba(255,255,255,1) 55%,rgba(255,255,255,0) 130%), url(' + this.couponToDisplay.imagePath + ')',
      'background-repeat': 'no-repeat',
      'background-position': 'left',
    }

    return couponStyles;
  }

  remove()
  {
    this.removeCoupon.emit(this.couponToDisplay);
  }

}
