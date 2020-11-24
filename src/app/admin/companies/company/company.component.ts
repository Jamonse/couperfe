import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Company } from 'src/app/authentication/model/company.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @Input()
  companyToDisplay: Company;

  @Output()
  updateCompany: EventEmitter<Company> = new EventEmitter<Company>();

  @Output()
  deleteCompany: EventEmitter<Company> = new EventEmitter<Company>();

  constructor() { }

  ngOnInit(): void {
  }

  update()
  {
    this.updateCompany.emit(this.companyToDisplay);
  }

  delete()
  {
    this.deleteCompany.emit(this.companyToDisplay);
  }

}
