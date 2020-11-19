import { Component, OnInit } from '@angular/core';
import { CommonListItem } from '../utils/common';

@Component({
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent implements OnInit {

  clientType = 'admin' //TODO - change to subscribe from state management in the future
  subHeadingMessage = `As a(n) ${this.clientType} there are several options available for you:`

  adminOptions: CommonListItem[] =[
    {icon: 'groups', message: 'Create, Update or Delete Company/ies'},
    {icon: 'person', message: 'Create Update or Delete Customer/s'},
    {icon: 'category', message: 'Create Update or Coupon Category/ies'}
  ]

  companyOptions: CommonListItem[] =[
    {icon: '', message: 'Create your own coupons!'},
    {icon: '', message: 'Offer them for sale on the website'}
  ]

  customerOptions: CommonListItem[] =[
    {icon: '', message: 'Watch up coupons from many companies'},
    {icon: '', message: 'Purchase a single coupon from each coupon as you wish'}
  ]

  clientOptions = this.adminOptions //TODO - change to subscribe from state management in the future

  constructor() { }

  ngOnInit(): void {
  }

}
