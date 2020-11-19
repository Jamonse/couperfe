import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuesPipe } from './pipe/values.pipe';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from '../core/material/material.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [ValuesPipe, LoadingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [ValuesPipe, LoadingComponent]
})
export class SharedModule { }
