import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/authentication/model/company.model';
import { CompaniesStore } from 'src/app/shared/companies/store/companies.store';
import { LoadingService } from 'src/app/shared/loading/service/loading.service';

@Component({
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.css']
})
export class CompanyDialogComponent implements OnInit {

  companyForm: FormGroup;

  dialogTitle: string;
  buttonTitle: string;
  dialogMode: 'add' | 'update';
  company: Company;

  passwordMessage: string;

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: CompanyDialogData,
    private companiesStore: CompaniesStore,
    private loadingService: LoadingService) 
    { 
      this.dialogMode = data.dialogMode;
      this.company = data.company;
  
      const formControls = {
        name: ['', [Validators.required,
            Validators.minLength(2),
            Validators.maxLength(25)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [ // Password is required only in creation mode
            this.conditionalValidator(() => this.dialogMode === 'add', Validators.required), 
            Validators.minLength(5), 
            Validators.maxLength(20)]]
      }

      if(this.dialogMode == 'update')
    {
      this.companyForm = this.formBuilder.group(formControls);
      this.companyForm.patchValue({...data.company});
      this.dialogTitle = `Update ${data.company.name}`;
      this.buttonTitle = 'Update';
      this.passwordMessage = 'Change company password';
    }
    else if(this.dialogMode == 'add')
    {
      this.companyForm = this.formBuilder.group(formControls);
      this.dialogTitle = 'Create New Category';
      this.buttonTitle = 'Create';
      this.passwordMessage = 'Select company password';
    }
    }

  ngOnInit(): void {
  }

  onSubmit()
  {
    if(this.companyForm.valid)
    {
      const comppany = {
        ...this.company,
        ...this.companyForm.value
      }
      
      const companySaved$ = this.companiesStore.saveCompany(comppany);
      this.loadingService.displayLoadingUntil(companySaved$).subscribe(
        () => this.dialogRef.close(comppany));
    }
  }

  onClose()
  {
    this.dialogRef.close();
  }

  conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn 
  {
    return (control: AbstractControl): {[key: string]: any} => {
      if (! condition()) {
        return null;
      }
      return validator(control);
    }
  }

}

export interface CompanyDialogData
{
  dialogMode: 'add' | 'update';
  company?: Company;
}
