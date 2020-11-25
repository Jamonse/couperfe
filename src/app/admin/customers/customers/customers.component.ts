import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Customer } from 'src/app/authentication/model/customer.model';
import { CustomersStore } from 'src/app/shared/customers/store/customers.stroe';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';

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

  customers$: Observable<Customer[]> = of([new Customer(1, 'c@c.com','Aa123', 'customer', 'customer')]);
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
  searchedCustomers: Customer[];

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
  {
    
  }

  loadSearchedCustomers()
  {

  }

  addCustomer()
  {

  }

}
