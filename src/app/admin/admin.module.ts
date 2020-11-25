import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CategoriesComponent } from './categories/categories/categories.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { CustomersComponent } from './customers/customers/customers.component';
import { CategoryComponent } from './categories/category/category.component';
import { MaterialModule } from '../core/material/material.module';
import { CategoryDialogComponent } from './categories/category-dialog/category-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyComponent } from './companies/company/company.component';
import { CompanyDialogComponent } from './companies/company-dialog/company-dialog.component';
import { CompanyInfoComponent } from './companies/company-info/company-info.component';
import { CustomerComponent } from './customers/customer/customer.component';
import { CustomerDialogComponent } from './customers/customer-dialog/customer-dialog.component';
import { CustomerInfoComponent } from './customers/customer-info/customer-info.component';


@NgModule({
  declarations: [
    CategoriesComponent, 
    CompaniesComponent, 
    CustomersComponent, 
    CategoryComponent, 
    CategoryDialogComponent, 
    CompanyComponent, 
    CompanyDialogComponent, 
    CompanyInfoComponent, CustomerComponent, CustomerDialogComponent, CustomerInfoComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminModule { }
