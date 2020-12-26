import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CouponSearchResult } from 'src/app/shared/coupons/model/coupon.search-result';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { ShopCouponStore } from 'src/app/shared/coupons/store/coupons-shop.store';
import { CouponUtils } from 'src/app/shared/coupons/utils/common';
import { CouponSortType } from 'src/app/shared/coupons/utils/coupon.sort-type';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { GlobalConfiguration, PageUtils } from 'src/app/shared/utils/common';
import { PurchaseDialogComponent } from '../purchase-dialog/purchase-dialog.component';

@Component({
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  MAX_SEARCH_RESULTS = 5;

  // Sort icon options
  UP_ARROW = 'keyboard_arrow_up';
  DOWN_ARROW = 'keyboard_arrow_down';

  coupons$: Observable<Coupon[]>;
  cart$: Observable<Coupon[]>;
  pageIndex: number;
  pageSize: number;
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
    private clientCouponsStore: ClientCouponsStore,
    public couponsStore: ShopCouponStore,
    public windowService: WindowSizeService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) 
    { 
      this.searchInput = this.formBuilder.group({searchInput: ''});
    }

    ngOnInit(): void {
      this.coupons$ = this.couponsStore.coupons$;
      this.cart$ = this.couponsStore.shoppingCart$;
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
        ...GlobalConfiguration.dialogGlobalConfiguration(),
        ...{data: {coupons: [coupon]}}
      }

      let dialogRef = this.dialog.open(PurchaseDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if(res)
        {
          this.loadCoupons();
          this.couponsStore.loadCart();
          this.clientCouponsStore.loadCoupons(ClientType.CUSTOMER);
          this.snackBar
            .open('Purchased Successfuly, Congatulations!', 'X', GlobalConfiguration.snackbarGlobalConfiguration())
        }
      })
    }

    addToCart(coupon: Coupon)
    {
      this.couponsStore.addToCart(coupon);
    }

    couponIncluded(coupon: Coupon, coupons: Coupon[])
    {
      return coupons.some(c => c.id == coupon.id);
    }

    get clientTypes(): typeof ClientType 
    {
      return ClientType; 
    }

}
