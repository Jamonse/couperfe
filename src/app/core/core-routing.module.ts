import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from '../authentication/guard/app.guard';
import { AuthGuard } from '../authentication/guard/auth.guard';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { ClientType } from './model/client-type';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

const routes: Routes =[
  {
    path: '', component: LayoutComponent, canActivate: [AppGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'terms', component: TermsOfUseComponent},
      {
        path: 'admin',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {roles: [ClientType.ADMIN]},
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'company',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {roles: [ClientType.COMPANY]},
        loadChildren: () => import('../company/company.module').then(m => m.CompanyModule)
      },
      {
        path: 'customer',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        data: {roles: [ClientType.CUSTOMER]},
        loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)
      }
    ]},
    
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
