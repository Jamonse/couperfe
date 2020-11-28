
import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface CommonListItem
{
  icon: string;
  message: string;
}

export interface MenuOption extends CommonListItem
{
  path: string;
}

export function conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn 
  {
    return (control: AbstractControl): {[key: string]: any} => {
      if (! condition()) {
        return null;
      }
      return validator(control);
    }
  }
