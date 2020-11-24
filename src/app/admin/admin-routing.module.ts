import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories/categories/categories.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { CompanyInfoComponent } from './companies/company-info/company-info.component';
import { CustomersComponent } from './customers/customers/customers.component';


const routes: Routes = [
  {
    path: '', 
    children: [
      {path: 'categories', component: CategoriesComponent},
      {path: 'companies', children: [
        {path: '', component: CompaniesComponent},
        {path: 'info/:id',  component: CompanyInfoComponent}
      ]},
      {path: 'customers', component: CustomersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
