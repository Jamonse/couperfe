import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { MenuOption } from 'src/app/shared/utils/common';
import { MenuOptions } from '../utils/options.utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  sideMenuButtonCliecked: EventEmitter<any> = new EventEmitter();

  navBarOptions: MenuOption[] = MenuOptions.navBarOptions;

  constructor(
    private authService: AuthenticationService, 
    private router: Router,
    public windowService: WindowSizeService) { }

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

}
