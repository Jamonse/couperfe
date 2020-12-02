import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/model/category.model';
import { CategoriesStore } from 'src/app/shared/categories/store/categories.store';
import { Coupon } from 'src/app/shared/coupons/model/coupon';
import { CompanyCouponsStore } from 'src/app/shared/coupons/store/company-coupons.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';

@Component({
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.css']
})
export class CouponDialogComponent implements OnInit {

  categories$: Observable<Category[]>

  couponForm: FormGroup;

  dialogTitle: string;
  buttonTitle: string;
  dialogMode: 'add' | 'update';
  coupon: Coupon;

  startDate: Date;

  selectedCategory: Category;
  selectedStartDate: Date;
  selectedEndDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CouponDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CouponDialogData,
    private couponsStore: CompanyCouponsStore,
    public categoiesStore: CategoriesStore,
    private loadingService: LoadingService,
    public windowService: WindowSizeService) 
    { 
      this.categories$ = this.categoiesStore.categories$;
      this.dialogMode = data.dialogMode;
      this.coupon = data.coupon;

      const formControls = {
        title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        price: ['', [Validators.required, Validators.min(0.05)]],
        quantity: ['' ,[Validators.required, Validators.min(1)]],
        category: ['', Validators.required],
        startDate: ['', [Validators.required, this.notBeforeToday]],
        endDate: ['', [Validators.required, this.notBeforeToday]],
        description: ['']
      }
      
      if(this.dialogMode == 'update')
      {
        this.selectedCategory = data.coupon.category;
        this.couponForm = this.formBuilder.group(formControls, 
          {validators: this.checkIfEndDateAfterStartDate});
        this.data.coupon.startDate = new Date(this.data.coupon.startDate);
        this.data.coupon.endDate = new Date(this.data.coupon.endDate);
        this.couponForm.patchValue({...data.coupon});
        this.dialogTitle = `Update ${data.coupon.title}`;
        this.buttonTitle = 'Update';
      }
      else if(this.dialogMode == 'add')
      {
        this.couponForm = this.formBuilder.group(formControls, 
          {validators: this.checkIfEndDateAfterStartDate});
        this.dialogTitle = 'Create New Coupon';
        this.buttonTitle = 'Create';
      }

      this.couponForm.get('startDate').valueChanges.subscribe(
        newValue => this.startDate = newValue
      )
    }

  ngOnInit(): void {
  }

  onSubmit()
  {
    if(this.couponForm.valid)
    {
      const coupon = {
        ...this.coupon,
        ...this.couponForm.value
      }
      
      const couponSaved$ = this.couponsStore.saveCoupon(coupon);
      this.loadingService.displayLoadingUntil(couponSaved$).subscribe(
        () => this.dialogRef.close(coupon));
    }
  }

  onClose()
  {
    this.dialogRef.close();
  }

  private notBeforeToday(dateControl: AbstractControl)
  {
    return new Date(dateControl.value).getTime() < Date.parse(new Date().toLocaleDateString())  ?
     { invalid: true } : null;
  }

  private checkIfEndDateAfterStartDate (c: AbstractControl) 
  {
    const startDate: Date = c.get('startDate').value;
    const endDate: Date = c.get('endDate').value;

    if (!startDate || !endDate)
    { 
      return null;
    }
    endDate.getTime() < startDate.getTime() ? 
      c.get('endDate').setErrors({beforeStartDate: true}) : c.get('endDate').setErrors(null);
   }

}

export interface CouponDialogData
{
  dialogMode: 'add' | 'update';
  coupon?: Coupon;
}
