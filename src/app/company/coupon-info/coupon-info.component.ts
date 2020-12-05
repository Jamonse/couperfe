import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { CouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';

@Component({
  templateUrl: './coupon-info.component.html',
  styleUrls: ['./coupon-info.component.css']
})
export class CouponInfoComponent implements OnInit {

  COMPANY_COUPONS_URL = '../../';

  couponToDisplay: Coupon;

  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;

  constructor(
    private couponsStore: ClientCouponsStore,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public windowService: WindowSizeService) 
    { 
      this.dialogBasicConfiguration = new MatDialogConfig();
      this.dialogBasicConfiguration.autoFocus = false;
      this.dialogBasicConfiguration.closeOnNavigation = true;
      this.dialogBasicConfiguration.width = '20rem';

      this.matSnackBarConfig = new MatSnackBarConfig();
      this.matSnackBarConfig.duration = 7000;
      this.matSnackBarConfig.panelClass = ['my-snack-bar'];
    }

  ngOnInit(): void {
    const loadedCoupon$ = this.couponsStore.loadCoupon(
      ClientType.COMPANY, 
      this.route.snapshot.params['id'])
      .pipe(
        tap(loadedCoupon => this.couponToDisplay = loadedCoupon),
        catchError(() => this.router.navigate([this.COMPANY_COUPONS_URL], {relativeTo: this.route})));
    this.loadingService.displayLoadingUntil(loadedCoupon$).subscribe();
  }

  updateCoupon()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', coupon: this.couponToDisplay}}
    }

    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((updatedCoupon: Coupon) => {
      if(updatedCoupon)
      {
        this.couponToDisplay = updatedCoupon;
        this.snackBar
          .open(`${updatedCoupon.title} was updated successfuly!`, 'X', this.matSnackBarConfig);
        this.couponsStore.loadCoupons(ClientType.COMPANY);
      }
    })
  }

  deleteCoupon()
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${this.couponToDisplay.title}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const couponDeleted$ = this.couponsStore.deleteCoupon(this.couponToDisplay.id);
        this.loadingService.displayLoadingUntil(couponDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${this.couponToDisplay.title} was deleted successfuly`, 'X', this.matSnackBarConfig)
            this.couponsStore.loadCoupons(ClientType.COMPANY);
            this.router.navigate([this.COMPANY_COUPONS_URL], {relativeTo: this.route, replaceUrl: true});
          }
        );
      }
    })
  }

}
