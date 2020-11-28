import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { Customer } from 'src/app/authentication/model/customer.model';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CustomersStore } from 'src/app/shared/customers/store/customers.stroe';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { CustomerSearchResult } from 'src/app/shared/model/customer.search-result';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Sort icon options
  UP_ARROW = 'keyboard_arrow_up';
  DOWN_ARROW = 'keyboard_arrow_down';

  MAX_SEARCH_RESULTS = 5;

  customers$: Observable<Customer[]>;
  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;
  // Selected sort option and direction
  sortBy: 'firstName' | 'lastName' | 'email';
  sortDirection: boolean = true;
  // Sort options and directions
  sortByOptions: string[] = ['First Name', 'Last Name', 'Email'];
  pageSizeOptions: number[] = [5, 7, 10];
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCustomers: CustomerSearchResult[];

  constructor(public customersStroe: CustomersStore,
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
    this.customers$ = this.customersStroe.customers$;
    this.sortBy = this.customersStroe.sortBy;
    this.sortDirection = this.customersStroe.sortDirection;
    this.loadSearchedCustomers();
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadCustomers())
    ) // Subscribe to paginator events, and load companies accordingly
    .subscribe();

    this.changeDetector.detectChanges();
  }

  loadCustomers()
  { // Load customers with current pagination properties
    this.sortBy ? 
    this.customersStroe // Sorting was selected
      .loadCustomers(this.paginator.pageIndex, 
        this.paginator.pageSize,
        this.sortBy,
        this.sortDirection) :
    this.customersStroe // Sorting not selected
      .loadCustomers(this.paginator.pageIndex, 
        this.paginator.pageSize);
  }

  loadSearchedCustomers()
  {
    // Subscribe to search input in order to load customers for each input change
    // accoring to input value
    this.searchInput.get('searchInput').valueChanges.pipe(
      debounceTime(300), // wait 300 ms after the last input change
      tap((searchInput) => this.searchText = searchInput), // Initialize searched text for highlighting
      switchMap(searchInput => this.customersStroe // If input changed,
        .loadSearchedCustomers(this.MAX_SEARCH_RESULTS, searchInput)),
      tap(searchedCompanies => this.searchedCustomers = searchedCompanies)
    ) // Load searched customers to the autocomplete source array
    .subscribe();
  }

  addCustomer()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'add'}}
    }

    let dialogRef = this.dialog.open(CustomerDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newCustomer => {
      if(newCustomer)
      {
        this.loadCustomers();
        this.snackBar
          .open(`${newCustomer.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  updateCustomer(customer: Customer)
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', customer: customer}}
    }

    let dialogRef = this.dialog.open(CustomerDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedCustomer => {
      if(updatedCustomer)
      {
        this.loadCustomers();
        this.snackBar
          .open(`${updatedCustomer.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  deleteCustomer(customer: Customer)
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${customer.name}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const customerDeleted$ = this.customersStroe.deleteCustomer(customer.id);
        this.loadingService.displayLoadingUntil(customerDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${customer.name} was deleted successfuly`, 'X', this.matSnackBarConfig)
            this.loadCustomers();
          }
        );
      }
    })
  }

  customerResultName(searchResult: CustomerSearchResult): string
  {
    return searchResult.firstName + " " + searchResult.lastName;
  }

}
