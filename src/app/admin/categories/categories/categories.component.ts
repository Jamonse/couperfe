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
import { GlobalConfiguration, PageUtils } from 'src/app/shared/utils/common';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories$: Observable<Category[]>;

  pageIndex: number = 0;
  pageSize: number = 5;
  length: number = 0;
  pageSizeOptions: number[] = PageUtils.DEFAULT_PAGE_SIZE_OPTIONS;

  searchInput: string;

  constructor(
    public windowService: WindowSizeService,
    private categoryStore: CategoriesStore,
    private dialog: MatDialog,
    private loadingSerivce: LoadingService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initPage()
  }

  addCategory()
  {
    const dialogConfig = { // Merge dialog config with data
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {dialogMode: 'add'}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newCategory => {
      if(newCategory)
      {
        this.snackBar
          .open(`${newCategory.name} was added successfuly!`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
      }
    })
  }

  updateCategory(category: Category)
  {
    const dialogConfig = { // Merge dialog config with data
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {dialogMode: 'update', category: category}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(updatedCategory => {
      if(updatedCategory)
      {
        this.snackBar
          .open(`${updatedCategory.name} was updated successfuly!`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
      }
    })
  }

  deleteCategory(category: Category)
  {
    const dialogConfig = { // Merge dialog config with message
      ...GlobalConfiguration.dialogGlobalConfiguration(),
      ...{data: {message: `Are you sure you want to delete ${category.name}?`}}
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => { // Confirmation dialog
      if(result)
      { // Delete operation confirmed
        const categoryDeleted$ = this.categoryStore.deleteCategory(category.id);
        this.loadingSerivce.displayLoadingUntil(categoryDeleted$).subscribe(() => {
          this.snackBar.open(`${category.name} was deleted successfuly`, 'X', GlobalConfiguration.snackbarGlobalConfiguration())
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
