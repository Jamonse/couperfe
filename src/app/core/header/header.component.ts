import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { MenuOption } from 'src/app/shared/utils/common';
import { ClientType } from '../model/client-type';
import { MenuOptions } from '../utils/options.utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  clientType$: Observable<ClientType>;
  shopStore: ShopCouponStore;

  @Output()
  sideMenuButtonCliecked: EventEmitter<any> = new EventEmitter();

  navBarOptions: MenuOption[] = MenuOptions.navBarOptions;

  constructor(
    private authService: AuthenticationService, 
    private router: Router,
    private injector: Injector,
    public windowService: WindowSizeService) 
    { 
      this.clientType$ = this.authService.clientType$;
      this.clientType$.subscribe(clientType => {
        if(clientType == ClientType.CUSTOMER)
        {
          this.shopStore = this.injector.get<ShopCouponStore>(ShopCouponStore);
        }
      })
    }

  ngOnInit(): void {
  }

  menuButtonClick()
  {
    this.sideMenuButtonCliecked.emit();
  }

  logout()
  {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
