import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ContentComponent } from './content/content.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    ContentComponent,
    FooterComponent,
    LayoutComponent,
    HomeComponent,
    AboutComponent,
    TermsOfUseComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule,
    CoreRoutingModule 
  ],
  exports: [
    LayoutComponent
  ]
})
export class CoreModule { }
