import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CouponSearchResult } from 'src/app/shared/coupons/model/coupon.search-result';
import { CompanyCouponsStore } from 'src/app/shared/coupons/store/company-coupons.store';
import { CouponSortType } from 'src/app/shared/coupons/utils/coupon.sort-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { CouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';

@Component({
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Sort icon options
  UP_ARROW = 'keyboard_arrow_up';
  DOWN_ARROW = 'keyboard_arrow_down';

  MAX_SEARCH_RESULTS = 5;

  coupons$: Observable<Coupon[]>;
  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;
  // Selected sort option and direction
  sortBy: CouponSortType;
  sortDirection: boolean;
  // Sort options and directions
  sortByOptions: string[] = ['Title', 
    'Description', 'Price', 'Quantity', 'Start Date', 'End Date'];
  pageSizeOptions: number[] = [5, 7, 10];
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCoupons: CouponSearchResult[];

  constructor(
    public couponsStore: CompanyCouponsStore,
    public windowService: WindowSizeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar) 
  { 
    this.searchInput = this.formBuilder.group({searchInput: ''});
    this.dialogBasicConfiguration = new MatDialogConfig();
    this.dialogBasicConfiguration.autoFocus = false;
    this.dialogBasicConfiguration.closeOnNavigation = true;
    this.dialogBasicConfiguration.width = '20rem';

    this.matSnackBarConfig = new MatSnackBarConfig();
    this.matSnackBarConfig.duration = 7000;
    this.matSnackBarConfig.panelClass = ['my-snack-bar'];
  }

  ngOnInit(): void {
    this.coupons$ = this.couponsStore.coupons$;
    this.sortBy = this.couponsStore.sortBy;
    this.sortDirection = this.couponsStore.sortDirection;
    this.loadSearchedCoupons();
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadCoupons())
    )
    .subscribe();

    this.changeDetector.detectChanges();
  }

  addCoupon()
  {
    const dialogConfig = {
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'add'}}
    }
    
    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((newCoupon: Coupon) => {
      if(newCoupon)
      {
        this.loadCoupons();
        this.snackBar
          .open(`${newCoupon.title} was added successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  loadCoupons()
  { // Load company coupons with current pagination properties
    this.sortBy ? 
    this.couponsStore // Sorting was selected
        .loadCoupons(this.paginator.pageIndex, 
          this.paginator.pageSize,
          this.sortBy,
          this.sortDirection) :
    this.couponsStore // Sorting not selected
        .loadCoupons(this.paginator.pageIndex, 
          this.paginator.pageSize);
  }

  loadSearchedCoupons()
  { // Subscribe to search input in order to load company coupons for each input change
    // accoring to input value
    this.searchInput.get('searchInput').valueChanges.pipe(
      debounceTime(300), // wait 300 ms after the last input change
      tap((searchInput) => this.searchText = searchInput), // Initialize searched text for highlighting
      switchMap(searchInput => this.couponsStore // If input changed,
        .loadSearchedCoupons(this.MAX_SEARCH_RESULTS, searchInput)),
      tap(searchedCoupons => this.searchedCoupons = searchedCoupons)
    ) // Load searched coupons to the autocomplete source array
    .subscribe();
  }

  updateCoupon(coupon: Coupon)
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', coupon: coupon}}
    }

    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((updatedCoupon: Coupon) => {
      if(updatedCoupon)
      {
        this.loadCoupons();
        this.snackBar
          .open(`${updatedCoupon.title} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  deleteCoupon(coupon: Coupon)
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${coupon.title}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const companyDeleted$ = this.couponsStore.deleteCoupon(coupon.id);
        this.loadingService.displayLoadingUntil(companyDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${coupon.title} was deleted successfuly`, 'X', this.matSnackBarConfig)
            this.loadCoupons();
          }
        );
      }
    })
  }

}
