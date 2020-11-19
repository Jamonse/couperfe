import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from 'src/app/core/model/category.model';
import { CategoriesStore } from 'src/app/shared/categories/store/categories.store';
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

  constructor(
    public windowService: WindowSizeService,
    private categoryStore: CategoriesStore,
    private loadingService: LoadingService,
    private dialog: MatDialog)
  { 
    this.dialogBasicConfiguration = new MatDialogConfig();
    this.dialogBasicConfiguration.autoFocus = false;
    this.dialogBasicConfiguration.closeOnNavigation = true;
    this.dialogBasicConfiguration.width = '20rem';
  }

  ngOnInit(): void {
    this.categories$ = this.categoryStore.categories$;
  }

  addCategory()
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'add'}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    // Getting the new category from the dialog and transfering it to the store for save
    dialogRef.afterClosed().subscribe(newCategory =>{
      const categorySaved$ = this.categoryStore.saveCategory(newCategory);
      this.loadingService.displayLoadingUntil(categorySaved$).subscribe();
    });
  }

  updateCategory(category: Category)
  {
    const dialogConfig = { // Merge dialog config with data
      ...this.dialogBasicConfiguration,
      ...{data: {dialogMode: 'update', category: category}}
    }

    let dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    // Getting the category from the dialog and transfering it to the store for update
    dialogRef.afterClosed().subscribe(categoryToUpdate => {
      const categoryUpdated$ = this.categoryStore.saveCategory(categoryToUpdate);
      this.loadingService.displayLoadingUntil(categoryUpdated$).subscribe();
    })

  }

  deleteCategory(category: Category)
  {

  }


}
