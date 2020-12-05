import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ClientType } from 'src/app/core/model/client-type';
import { Coupon } from '../model/coupon';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {

  @Input()
  clientType: ClientType;
  
  @Input()
  couponToDisplay: Coupon;

  @Output()
  updateCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

  @Output()
  deleteCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

  @Output()
  buyCoupon: EventEmitter<Coupon> = new EventEmitter<Coupon>();

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

  buy()
  {
    this.buyCoupon.emit(this.couponToDisplay);
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
