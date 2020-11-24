import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/core/model/category.model';
import { CategoriesStore } from 'src/app/shared/categories/store/categories.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

@Component({
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  categoryForm: FormGroup;

  dialogTitle: string;
  buttonTitle: string;
  dialogMode: 'add' | 'update';
  category: Category;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: CategoryDialogData,
    private categoryStore: CategoriesStore,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar)
  {
    this.dialogMode = data.dialogMode;
    this.category = data.category;

    const formControls = {
      name: ['', [Validators.required,
           Validators.minLength(2),
          Validators.maxLength(25)]]
    }

    if(this.dialogMode == 'update')
    {
      this.categoryForm = this.formBuilder.group(formControls);
      this.categoryForm.patchValue({...data.category});
      this.dialogTitle = `Update ${data.category.name}`;
      this.buttonTitle = 'Update';
    }
    else if(this.dialogMode == 'add')
    {
      this.categoryForm = this.formBuilder.group(formControls);
      this.dialogTitle = 'Create New Category';
      this.buttonTitle = 'Create';
    }

  }

  ngOnInit(): void {
  }

  onSubmit()
  {
    if(this.categoryForm.valid)
    {
      const category: Category = {
        ...this.category,
        ...this.categoryForm.value
      }
      
      const categorySaved$ = this.categoryStore.saveCategory(category);
      this.loadingService.displayLoadingUntil(categorySaved$).subscribe(
        () => this.dialogRef.close(category));
    }
  }

  onClose()
  {
    this.dialogRef.close();
  }
  
}

export interface CategoryDialogData
{
  dialogMode: 'add' | 'update';
  category?: Category;
}
