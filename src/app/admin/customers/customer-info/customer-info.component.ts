import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Customer } from 'src/app/authentication/model/customer.model';
import { CustomersStore } from 'src/app/shared/customers/store/customers.stroe';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';

@Component({
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {

  CUSTOMERS_URL = '../../';

  customerToDisplay: Customer;

  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;

  constructor(
    private customersStore: CustomersStore,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) 
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
    const loadedCustomer$ = this.customersStore.loadCustomer(this.route.snapshot.params['id'])
      .pipe(
        tap(loadedCompany => this.customerToDisplay = loadedCompany),
        catchError(() => this.router.navigate([this.CUSTOMERS_URL], {relativeTo: this.route})));
    this.loadingService.displayLoadingUntil(loadedCustomer$).subscribe();
  }

  updateCustomer()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', customer: this.customerToDisplay}}
    }

    let dialogRef = this.dialog.open(CustomerDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedCustomer => {
      if(updatedCustomer)
      {
        this.customerToDisplay = updatedCustomer;
        this.snackBar
          .open(`${updatedCustomer.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  deleteCustomer()
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${this.customerToDisplay.name}?`}}
    }

    let dialogRef = this.dialog.open(CustomerDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const customerDeleted$ = this.customersStore.deleteCustomer(this.customerToDisplay.id);
        this.loadingService.displayLoadingUntil(customerDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${this.customerToDisplay.name} was deleted successfuly`, 'X', this.matSnackBarConfig);
            this.router.navigate([this.CUSTOMERS_URL], {relativeTo: this.route, replaceUrl: true});
          }
        );
      }
    })
  }

}
