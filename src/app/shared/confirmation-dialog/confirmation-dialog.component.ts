import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfimationDialogData)
  { 
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  onYes()
  {
    this.dialogRef.close(true);
  }

  onNo()
  {
    this.dialogRef.close(false);
  }

}

export interface ConfimationDialogData
{
  message: string;
}
