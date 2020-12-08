import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CouponSearchResult } from 'src/app/shared/coupons/model/coupon.search-result';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';
import { CouponSortType } from 'src/app/shared/coupons/utils/coupon.sort-type';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';

@Component({
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  MAX_SEARCH_RESULTS = 5;

  // Sort icon options
  UP_ARROW = 'keyboard_arrow_up';
  DOWN_ARROW = 'keyboard_arrow_down';

  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;

  coupons$: Observable<Coupon[]>;
  pageIndex: number;
  pageSize: number;
  sortBy: CouponSortType; 
  sortDirection: boolean;
  // Sort options and directions
  sortByOptions: string[][] = [
    ['Title', 'title'],
    ['Description', 'description'],
    ['Price', 'price'], 
    ['Quantity', 'quantity'], 
    ['Start Date', 'startDate'], 
    ['End Date', 'endDate']
  ];
  pageSizeOptions: number[] = [5, 7, 10];
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCoupons: CouponSearchResult[];

  constructor(
    private clientCouponsStore: ClientCouponsStore,
    public couponsStore: ShopCouponStore,
    public windowService: WindowSizeService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) 
    { 
      this.searchInput = this.formBuilder.group({searchInput: ''});
      this.dialogBasicConfiguration = new MatDialogConfig();
      this.dialogBasicConfiguration.autoFocus = false;
      this.dialogBasicConfiguration.closeOnNavigation = true;
      this.dialogBasicConfiguration.width = '25rem';

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
      this.changeDetector.detectChanges();
    }
  
    loadCoupons()
    { // Load company coupons with current pagination properties
      this.sortBy ? 
      this.couponsStore // Sorting was selected
          .loadCoupons(
            this.pageIndex, 
            this.pageSize,
            this.sortBy,
            this.sortDirection) :
      this.couponsStore // Sorting not selected
          .loadCoupons( 
            this.pageIndex, 
            this.pageSize);
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

    buyCoupon(coupon: Coupon)
    {
      const dialogConfig = {
        ...this.dialogBasicConfiguration,
        ...{data: {coupons: [coupon]}}
      }

      let dialogRef = this.dialog.open(PurchaseDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if(res)
        {
          this.loadCoupons();
          this.clientCouponsStore.loadCoupons(ClientType.CUSTOMER);
          this.snackBar
            .open('Purchased Successfuly, Congatulations!', 'X', this.matSnackBarConfig)
        }
      })
    }

    get clientTypes(): typeof ClientType 
    {
      return ClientType; 
    }

}
