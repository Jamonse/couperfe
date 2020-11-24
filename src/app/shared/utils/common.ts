import { validateBasis } from '@angular/flex-layout';

export interface CommonListItem
{
  icon: string;
  message: string;
}

export interface MenuOption extends CommonListItem
{
  path: string;
}
