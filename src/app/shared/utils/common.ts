
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

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

export class PageUtils
{
  public static DEFAULT_PAGE_SIZE_OPTIONS = [5, 7, 10];
}

export class GlobalConfiguration
{
  public static dialogGlobalConfiguration(): MatDialogConfig
  {
    const dialogGlobalConfiguration = new MatDialogConfig();
    dialogGlobalConfiguration.autoFocus = false;
    dialogGlobalConfiguration.closeOnNavigation = true;
    dialogGlobalConfiguration.width = '20rem';
    return dialogGlobalConfiguration
  }

  public static snackbarGlobalConfiguration(): MatSnackBarConfig
  {
    const globalSnackBarConfig = new MatSnackBarConfig();
    globalSnackBarConfig.duration = 7000;
    globalSnackBarConfig.panelClass = ['my-snack-bar'];
    return globalSnackBarConfig;
  }
}
