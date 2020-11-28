import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WindowSizeService } from 'src/app/shared/service/window-size.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  opened: boolean = false;
  onTop: Observable<any>;

  constructor(public windowService: WindowSizeService) { }

  ngOnInit(): void {
  }

}
