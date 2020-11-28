import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'src/app/authentication/model/customer.model';
import { CustomersStore } from 'src/app/shared/customers/store/customers.stroe';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';
import { conditionalValidator } from 'src/app/shared/utils/common';

@Component({
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css']
})
export class CustomerDialogComponent implements OnInit {

  customerForm: FormGroup;

  dialogTitle: string;
  buttonTitle: string;
  dialogMode: 'add' | 'update';
  customer: Customer;

  passwordMessage: string;
  
  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: CustomerDialogData,
    private companiesStore: CustomersStore,
    private loadingService: LoadingService) 
    { 
      this.dialogMode = data.dialogMode;
      this.customer = data.customer;
  
      const formControls = {
        firstName: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(25)]],
        lastName: ['', [Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [ // Password is required only in creation mode
            conditionalValidator(() => this.dialogMode === 'add', Validators.required), 
            Validators.minLength(5), 
            Validators.maxLength(20)]]
      }

      if(this.dialogMode == 'update')
      {
        this.customerForm = this.formBuilder.group(formControls);
        this.customerForm.patchValue({...data.customer});
        this.dialogTitle = `Update ${data.customer.name}`;
        this.buttonTitle = 'Update';
        this.passwordMessage = 'Change customer password';
      }
      else if(this.dialogMode == 'add')
      {
        this.customerForm = this.formBuilder.group(formControls);
        this.dialogTitle = 'Create New Customer';
        this.buttonTitle = 'Create';
        this.passwordMessage = 'Select customer password';
      }

    }

  ngOnInit(): void {
  }

  onSubmit()
  {
    if(this.customerForm.valid)
    {
      const customer = {
        ...this.customer,
        ...this.customerForm.value
      }
      
      const companySaved$ = this.companiesStore.saveCustomer(customer);
      this.loadingService.displayLoadingUntil(companySaved$).subscribe(
        () => this.dialogRef.close(customer));
    }
  }

  onClose()
  {
    this.dialogRef.close();
  }

}

export interface CustomerDialogData
{
  dialogMode: 'add' | 'update';
  customer?: Customer;
}
