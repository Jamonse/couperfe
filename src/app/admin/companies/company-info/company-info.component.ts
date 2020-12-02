import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Company } from 'src/app/authentication/model/company.model';
import { CompaniesStore } from 'src/app/shared/companies/store/companies.store';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { CompanyDialogComponent } from '../company-dialog/company-dialog.component';

@Component({
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
  
  COMPANIES_URL = '../../';

  companyToDiaply: Company;

  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;

  constructor(
    private companiesStore: CompaniesStore,
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
    const loadedCompany$ = this.companiesStore.loadCompany(this.route.snapshot.params['id'])
      .pipe(
        tap(loadedCompany => this.companyToDiaply = loadedCompany),
        catchError(() => this.router.navigate([this.COMPANIES_URL], {relativeTo: this.route})));
    this.loadingService.displayLoadingUntil(loadedCompany$).subscribe();
  }

  updateCompany()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', company: this.companyToDiaply}}
    }

    let dialogRef = this.dialog.open(CompanyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((updatedCompany: Company) => {
      if(updatedCompany)
      {
        this.companyToDiaply = updatedCompany;
        this.snackBar
          .open(`${updatedCompany.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
        this.companiesStore.loadCompanies();
      }
    });
  }

  deleteCompany()
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${this.companyToDiaply.name}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      { // Delete operation confirmed
        const companyDeleted$ = this.companiesStore.deleteCompany(this.companyToDiaply.id);
        this.loadingService.displayLoadingUntil(companyDeleted$).subscribe(
          () => {
            this.snackBar
              .open(`${this.companyToDiaply.name} was deleted successfuly`, 'X', this.matSnackBarConfig)
            this.companiesStore.loadCompanies();
            this.router.navigate([this.COMPANIES_URL], {relativeTo: this.route, replaceUrl: true});
          }
        );
      }
    });
  }

}
