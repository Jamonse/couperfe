import { Component, OnInit } from '@angular/core';
import { CommonListItem } from 'src/app/shared/utils/common';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  headingMessage = 'Looking to purchase coupns?';
  subHeadingMessage = 'You have came to the right place!';
  headingParagraphMessage = 'In Couper you will find all the latest coupon releases '
   + 'from the best of the brands from all around the world';

  homeList: CommonListItem[] = [
    {icon: 'public', message: 'Watch up hundereds of coupons'},
    {icon: 'check_circle', message: 'Select as you wish'},
    {icon: 'credit_card', message: 'Claim your order'},
    {icon: 'sentiment_satisfied_alt', message: 'Enjoy!'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}


