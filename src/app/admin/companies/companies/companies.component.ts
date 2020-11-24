import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { CompaniesStore } from 'src/app/shared/companies/store/companies.store';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { CompanyDialogComponent } from '../company-dialog/company-dialog.component';

@Component({
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Sort icon options
  UP_ARROW = 'keyboard_arrow_up';
  DOWN_ARROW = 'keyboard_arrow_down';

  MAX_SEARCH_RESULTS = 5;

  companies$: Observable<Company[]>;
  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;
  // Selected sort option and direction
  sortBy: 'name' | 'email';
  sortDirection: boolean;
  // Sort options and directions
  sortByOptions: string[] = ['name','email'];
  pageSizeOptions: number[] = [5, 7, 10];
  // Search bar and autocomplete
  searchInput: FormGroup;
  searchText: string;
  searchedCompanies: Company[];

  constructor(
    public companiesStroe: CompaniesStore,
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
    this.companies$ = this.companiesStroe.companies$;
    this.sortBy = this.companiesStroe.sortBy;
    this.sortDirection = this.companiesStroe.sortDirection;
    this.loadSearchedCompanies();
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadCompanies())
    ) // Subscribe to paginator events, and load companies accordingly
    .subscribe();

    this.changeDetector.detectChanges();
  }

  loadCompanies()
  { // Load companies with current pagination properties
    this.companiesStroe
        .loadCompanies(this.paginator.pageIndex, 
          this.paginator.pageSize,
          this.sortBy,
          this.sortDirection);
  }

  loadSearchedCompanies()
  { // Subscribe to search input in order to load companies for each input change
    // accoring to input value
    this.searchInput.get('searchInput').valueChanges.pipe(
      debounceTime(300), // wait 300 ms after the last input change
      tap((searchInput) => this.searchText = searchInput), // Initialize searched text for highlighting
      switchMap(searchInput => this.companiesStroe // If input changed,
        .loadSearchedCompanies(this.MAX_SEARCH_RESULTS, searchInput)),
      tap(searchedCompanies => this.searchedCompanies = searchedCompanies)
    ) // Load searched companies to the autocomplete source array
    .subscribe();
  }

  addCompany()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'add'}}
    }

    let dialogRef = this.dialog.open(CompanyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newCompany => {
      if(newCompany)
      {
        this.loadCompanies();
        this.snackBar
          .open(`${newCompany.name} was added successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  updateCompany(company: Company)
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', company: company}}
    }

    let dialogRef = this.dialog.open(CompanyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedCompany => {
      if(updatedCompany)
      {
        this.loadCompanies();
        this.snackBar
          .open(`${updatedCompany.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  deleteCompany(company: Company)
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${company.name}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const companyDeleted$ = this.companiesStroe.deleteCompany(company.id);
        this.loadingService.displayLoadingUntil(companyDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${company.name} was deleted successfuly`, 'X', this.matSnackBarConfig)
            this.loadCompanies();
          }
        );
      }
    })
  }

}
