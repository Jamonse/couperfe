import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories/categories/categories.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { CustomersComponent } from './customers/customers/customers.component';


const routes: Routes = [
  {
    path: '', 
    children: [
      {path: 'categories', component: CategoriesComponent},
      {path: 'companies', component: CompaniesComponent},
      {path: 'customers', component: CustomersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
