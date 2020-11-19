import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from '../admin/categories/categories/categories.component';
import { AppGuard } from '../authentication/guard/app.guard';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

const routes: Routes =[
  {path: '', component: LayoutComponent, canActivate: [AppGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'about', component: AboutComponent},
      {path: 'terms', component: TermsOfUseComponent},
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
      }
    ]},
    
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
