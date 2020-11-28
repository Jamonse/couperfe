import { MenuOption } from 'src/app/shared/utils/common';

export class MenuOptions
{
    static navBarOptions: MenuOption[] = [
        {message: 'Home', path: '/home', icon: 'home'},
        {message: 'About', path: '/about', icon: 'info'},
        {message: 'Terms of Use', path: '/terms', icon: 'gavel'}
      ]
}
