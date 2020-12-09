import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CouponSearchResult } from 'src/app/shared/coupons/model/coupon.search-result';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { CouponUtils } from 'src/app/shared/coupons/utils/common';
import { CouponSortType } from 'src/app/shared/coupons/utils/coupon.sort-type';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { GlobalConfiguration, PageUtils } from 'src/app/shared/utils/common';
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
  // Selected sort option and direction
  sortBy: CouponSortType; 
  sortDirection: boolean;
  // Sort options and directions
  sortByOptions: string[][] = CouponUtils.COUPON_SORT_OPTIONS;
  pageSizeOptions: number[] = PageUtils.DEFAULT_PAGE_SIZE_OPTIONS;
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCoupons: CouponSearchResult[];

  constructor(
    public couponsStore: ClientCouponsStore,
    public windowService: WindowSizeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar) 
  { 
    this.searchInput = this.formBuilder.group({searchInput: ''});
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
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {dialogMode: 'add'}}
    }
    
    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((newCoupon: Coupon) => {
      if(newCoupon)
      {
        this.loadCoupons();
        this.snackBar
          .open(`${newCoupon.title} was added successfuly!`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
      }
    })
  }

  loadCoupons()
  { // Load company coupons with current pagination properties
    this.sortBy ? 
    this.couponsStore // Sorting was selected
        .loadCoupons(ClientType.COMPANY, 
          this.paginator.pageIndex, 
          this.paginator.pageSize,
          this.sortBy,
          this.sortDirection) :
    this.couponsStore // Sorting not selected
        .loadCoupons(ClientType.COMPANY ,
          this.paginator.pageIndex, 
          this.paginator.pageSize);
  }

  loadSearchedCoupons()
  { // Subscribe to search input in order to load company coupons for each input change
    // accoring to input value
    this.searchInput.get('searchInput').valueChanges.pipe(
      debounceTime(300), // wait 300 ms after the last input change
      tap((searchInput) => this.searchText = searchInput), // Initialize searched text for highlighting
      switchMap(searchInput => this.couponsStore // If input changed,
        .loadSearchedCoupons(ClientType.COMPANY, this.MAX_SEARCH_RESULTS, searchInput)),
      tap(searchedCoupons => this.searchedCoupons = searchedCoupons)
    ) // Load searched coupons to the autocomplete source array
    .subscribe();
  }

  updateCoupon(coupon: Coupon)
  {
    const dialogConfig = { // Merge dialog config with data
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {dialogMode: 'update', coupon: coupon}}
    }

    let dialogRef = this.dialog.open(CouponDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((updatedCoupon: Coupon) => {
      if(updatedCoupon)
      {
        this.loadCoupons();
        this.snackBar
          .open(`${updatedCoupon.title} was updated successfuly!`, 'X', )
      }
    })
  }

  deleteCoupon(coupon: Coupon)
  {
    const dialogConfig = { // Merge dialog config with message
      ...GlobalConfiguration.dialogGlobalConfiguration(),
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
              .open(`${coupon.title} was deleted successfuly`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
            this.loadCoupons();
          }
        );
      }
    })
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
