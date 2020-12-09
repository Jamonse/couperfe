import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ClientType } from 'src/app/core/model/client-type';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CouponSearchResult } from 'src/app/shared/coupons/model/coupon.search-result';
import { ClientCouponsStore } from 'src/app/shared/coupons/store/client-coupons.store';
import { CouponUtils } from 'src/app/shared/coupons/utils/common';
import { CouponSortType } from 'src/app/shared/coupons/utils/coupon.sort-type';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';

@Component({
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  MAX_SEARCH_RESULTS = 5;

   // Sort icon options
   UP_ARROW = 'keyboard_arrow_up';
   DOWN_ARROW = 'keyboard_arrow_down';

  coupons$: Observable<Coupon[]>;
  sortBy: CouponSortType; 
  sortDirection: boolean;
  // Sort options and directions
  sortByOptions: string[][] = CouponUtils.COUPON_SORT_OPTIONS;
  pageSizeOptions: number[] = [5, 7, 10];
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCoupons: CouponSearchResult[];

  constructor(
    public couponsStore: ClientCouponsStore,
    public windowService: WindowSizeService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder) 
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

  loadCoupons()
  { // Load company coupons with current pagination properties
    this.sortBy ? 
    this.couponsStore // Sorting was selected
        .loadCoupons(ClientType.CUSTOMER, 
          this.paginator.pageIndex, 
          this.paginator.pageSize,
          this.sortBy,
          this.sortDirection) :
    this.couponsStore // Sorting not selected
        .loadCoupons(ClientType.CUSTOMER, 
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
        .loadSearchedCoupons(ClientType.CUSTOMER, this.MAX_SEARCH_RESULTS, searchInput)),
      tap(searchedCoupons => this.searchedCoupons = searchedCoupons)
    ) // Load searched coupons to the autocomplete source array
    .subscribe();
  }

  get clientTypes(): typeof ClientType 
  {
    return ClientType; 
  }

}
