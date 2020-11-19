import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { MenuOption } from '../utils/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  sideMenuButtonCliecked: EventEmitter<any> = new EventEmitter();

  navBarOptions: MenuOption[] = [
    {message: 'Home', path: '/home', icon: 'home'},
    {message: 'About', path: '/about', icon: 'info'},
    {message: 'Terms of Use', path: '/terms', icon: 'gavel'}
  ]

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
