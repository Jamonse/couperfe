import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  coupons$;

  constructor() { }

  ngOnInit(): void {
  }

}
