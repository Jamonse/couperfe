import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Category } from 'src/app/core/model/category.model';
import { CategoriesStore } from 'src/app/shared/categories/store/categories.store';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories$: Observable<Category[]>;
  dialogBasicConfiguration: MatDialogConfig;
  matSnackBarConfig: MatSnackBarConfig;

  pageIndex: number = 0;
  pageSize: number = 5;
  length: number = 0;
  pageSizeOptions: number[] = [5, 10];

  searchInput: string;

  constructor(
    public windowService: WindowSizeService,
    private categoryStore: CategoriesStore,
    private dialog: MatDialog,
    private loadingSerivce: LoadingService,
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
    this.initPage()
  }

  addCategory()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'add'}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newCategory => {
      if(newCategory)
      {
        this.snackBar
          .open(`${newCategory.name} was added successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  updateCategory(category: Category)
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', category: category}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedCategory => {
      if(updatedCategory)
      {
        this.snackBar
          .open(`${updatedCategory.name} was updated successfuly!`, 'X', this.matSnackBarConfig)
      }
    })
  }

  deleteCategory(category: Category)
  {
    const dialogConfig = { // Merge dialog config with message
      ...this.dialogBasicConfiguration,
      ...{data: {message: `Are you sure you want to delete ${category.name}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => { // Confirmation dialog
      if(result)
      { // Delete operation confirmed
        const categoryDeleted$ = this.categoryStore.deleteCategory(category.id);
        this.loadingSerivce.displayLoadingUntil(categoryDeleted$).subscribe(() => {
          this.snackBar.open(`${category.name} was deleted successfuly`, 'X', this.matSnackBarConfig)
        });
      }
    })
  }

  pageChanged(event: PageEvent)
  {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initPage();
  }

  searchInputChanged()
  {
    this.initPage();
  }

  initPage()
  { // Pagination update
    this.categories$ = this.categoryStore.categories$.pipe(
      map(categories => { // Filter categories to display based on search input
        if(!this.searchInput || this.searchInput === '')
        {
          return categories;
        }
        return categories.filter(category => 
          category.name.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()));
      }), // Initialize total length
      tap(categories => this.length = categories.length),
      map(categories => categories.slice( // Initialize page index
        this.pageIndex == 0 ? 0 : this.pageIndex * this.pageSize,
        (this.pageIndex * this.pageSize) + this.pageSize))
    );
  }
}
