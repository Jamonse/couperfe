import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { Customer } from 'src/app/authentication/model/customer.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { MenuOption } from '../utils/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuOptions: MenuOption[] = [];
  myCoupons: MenuOption = {path: 'coupons', message: 'My Coupons', icon: 'logo.svg'}

  @Output()
  menuButtonClick: EventEmitter<any> = new EventEmitter();

  adminOptions: MenuOption[] = [
    {path: '/admin/categories', message: 'Categories', icon: 'category'},
    {path: '/admin/companies', message: 'Companies', icon: 'groups'},
    {path: '/admin/customers', message: 'Customers', icon: 'person'}
  ]

  companyOptions: MenuOption[] = [
    {path: 'profile', message: 'My Profile', icon: 'account_circle'},
    
  ]

  customerOptions: MenuOption[] = [
    {path: 'profile', message: 'My Profile', icon: 'account_circle'},
    {path: 'buy', message: 'Buy Coupons', icon: 'credit_card'}
  ]

  constructor(
    private authService: AuthenticationService) 
  { 
    this.authService.user$.pipe(tap(currentUser => {
      if(currentUser)
      {
        if(currentUser instanceof Company)
        {
          this.menuOptions = this.companyOptions;
        }
        else if(currentUser instanceof Customer)
        {
          this.menuOptions = this.customerOptions;
        }
      }
      this.menuOptions = this.adminOptions;
    }))
    .subscribe()
  }

  ngOnInit(): void {
  }

  menuButtonClicked()
  {
    this.menuButtonClick.emit();
  }

}
