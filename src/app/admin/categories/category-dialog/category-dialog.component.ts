import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/core/model/category.model';
import { CategoriesStore } from 'src/app/shared/categories/store/categories.store';

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
    private categoryStore: CategoriesStore)
  {
    this.dialogMode = data.dialogMode;
    this.category = data.category;

    const formControls = {
      name: ['', [Validators.required, Validators.minLength(2)]]
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

  onClose()
  {
    this.dialogRef.close();
  }

  onSubmit()
  {
    const category: Category = {
      ...this.category,
      ...this.categoryForm.value
    }

    this.dialogRef.close(category);
  }

}

export interface CategoryDialogData
{
  dialogMode: 'add' | 'update';
  category?: Category;
}
