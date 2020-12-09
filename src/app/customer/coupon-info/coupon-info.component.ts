import { Component, OnInit } from '@angular/core';
import { ClientType } from 'src/app/core/model/client-type';

@Component({
  templateUrl: './coupon-info.component.html',
  styleUrls: ['./coupon-info.component.css']
})
export class CouponInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
