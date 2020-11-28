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



@NgModule({
  declarations: [
    ValuesPipe, 
    LoadingComponent, 
    MessagesComponent, 
    ConfirmationDialogComponent, 
    RemoveFocusDirective, 
    HighlightSearchPipe],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    ValuesPipe, 
    LoadingComponent, 
    MessagesComponent, 
    RemoveFocusDirective, 
    HighlightSearchPipe]
})
export class SharedModule { }
