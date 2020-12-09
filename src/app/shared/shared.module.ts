import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuesPipe } from './pipe/values.pipe';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from '../core/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { RemoveFocusDirective } from './remove-focus.directive';
import { HighlightSearchPipe } from './pipe/highlight-search.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { StockPipe } from './coupons/pipe/stock.pipe';
import { CouponComponent } from './coupons/coupon/coupon.component';
import { RouterModule } from '@angular/router';
import { CouponInfoComponent } from './coupons/coupon-info/coupon-info.component';



@NgModule({
  declarations: [
    ValuesPipe, 
    LoadingComponent, 
    MessagesComponent, 
    ConfirmationDialogComponent, 
    RemoveFocusDirective, 
    HighlightSearchPipe, 
    StockPipe, 
    CouponComponent, 
    CouponInfoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    MatNativeDateModule,
    RouterModule
  ],
  exports: [
    ValuesPipe, 
    LoadingComponent, 
    MessagesComponent,
    CouponComponent,
    RemoveFocusDirective, 
    HighlightSearchPipe, 
    StockPipe,
    CouponInfoComponent
  ]
})
export class SharedModule { }
