import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Coupon } from 'src/app/shared/coupons/model/coupon';

@Component({
  selector: 'app-company-coupon',
  templateUrl: './company-coupon.component.html',
  styleUrls: ['./company-coupon.component.css']
})
export class CompanyCouponComponent implements OnInit {

  @Input()
  couponToDisplay: Coupon;

  @Output()
  updateCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

  @Output()
  deleteCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

  constructor() { }

  ngOnInit(): void {
  }

  update()
  {
    this.updateCoupon.emit(this.couponToDisplay);
  }

  delete()
  {
    this.deleteCoupon.emit(this.couponToDisplay);
  }

}
