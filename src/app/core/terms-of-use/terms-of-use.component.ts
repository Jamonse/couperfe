import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { CommonListItem } from 'src/app/shared/utils/common';
import { ClientType } from '../model/client-type';

@Component({
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent implements OnInit {

  clientType: ClientType;
  subHeadingMessage: string;

  termsOptions: CommonListItem[];

  adminOptions: CommonListItem[] =[
    {icon: 'groups', message: 'Create, Update or Delete Company/ies'},
    {icon: 'person', message: 'Create Update or Delete Customer/s'},
    {icon: 'category', message: 'Create Update or Coupon Category/ies'}
  ]

  companyOptions: CommonListItem[] =[
    {icon: 'C', message: 'Create your own coupons!'},
    {icon: 'attach_money', message: 'Offer them for sale on the website'}
  ]

  customerOptions: CommonListItem[] =[
    {icon: 'C', message: 'Watch up coupons from many companies'},
    {icon: 'credit_card', message: 'Purchase a single coupon from each coupon as you wish'}
  ]

  constructor(private authService: AuthenticationService) 
  { 
    this.authService.clientType$.subscribe(clientType => {
      this.clientType = clientType;
      this.subHeadingMessage = 
        `As a(n) ${clientType} there are several options available for you:`;
        switch(clientType)
        {
          case ClientType.ADMIN:
            this.termsOptions = this.adminOptions;
            break;
          case ClientType.COMPANY:
            this.termsOptions = this.companyOptions;
            break;
          case ClientType.CUSTOMER:
            this.termsOptions = this.customerOptions;
            break;
        }
    });
  }

  ngOnInit(): void {
  }

}
