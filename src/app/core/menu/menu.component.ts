import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { MenuOption } from 'src/app/shared/utils/common';
import { ClientType } from '../model/client-type';
import { MenuOptions } from '../utils/options.utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuOptions: MenuOption[] = [];
  navBarOptions: MenuOption[] = MenuOptions.navBarOptions;

  @Output()
  menuButtonClick: EventEmitter<any> = new EventEmitter();

  adminOptions: MenuOption[] = [
    {path: '/admin/categories', message: 'Categories', icon: 'category'},
    {path: '/admin/companies', message: 'Companies', icon: 'groups'},
    {path: '/admin/customers', message: 'Customers', icon: 'person'}
  ]

  companyOptions: MenuOption[] = [
    {path: '/company/profile', message: 'My Profile', icon: 'account_circle'},
    {path: '/company/my-coupons', message: 'My Coupons', icon: 'logo.svg'}
  ]

  customerOptions: MenuOption[] = [
    {path: '/customer/profile', message: 'My Profile', icon: 'account_circle'},
    {path: '/customer/my-coupons', message: 'My Coupons', icon: 'logo.svg'},
    {path: '/customer/shop', message: 'Buy Coupons', icon: 'attach_money'}
  ]

  constructor(
    private authService: AuthenticationService,
    public windowService: WindowSizeService) 
  { 
    this.authService.clientType$.pipe(tap(clientType => {
      switch(clientType)
      {
        case ClientType.ADMIN:
        this.menuOptions = this.adminOptions;
        break;
        case ClientType.COMPANY:
        this.menuOptions = this.companyOptions;
        break;
        case ClientType.CUSTOMER:
        this.menuOptions = this.customerOptions;
        break;
      }
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
