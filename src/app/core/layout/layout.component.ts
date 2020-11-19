import { Component, OnInit } from '@angular/core';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  opened: boolean = false;

  constructor(public windowService: WindowSizeService) { }

  ngOnInit(): void {
  }

}
