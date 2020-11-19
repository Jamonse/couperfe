import { Component, OnInit } from '@angular/core';
import { CommonListItem } from '../utils/common';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  headlineMessage = 'As a coupons sale and publish company, we strive to offer the best experience in the market'
  subHeadline1 = 'Create your coupons and offer them for your price'
  subHeadline2 = 'Watch hundereds of offers from the best companies all around the world'

  contactInformation: CommonListItem[] = [
    {icon: 'email', message: 'Our sales support department: sales@couper.com'},
    {icon: 'email', message: 'Information and data: info@couper.com'},
    {icon: 'call', message: 'Phone number: +972 55-124325'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
