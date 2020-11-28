import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Customer } from 'src/app/authentication/model/customer.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @Input()
  customerToDisplay: Customer;

  @Output()
  updateCustomer: EventEmitter<Customer> = new EventEmitter<Customer>();

  @Output()
  deleteCustomer: EventEmitter<Customer> = new EventEmitter<Customer>();

  constructor() { }

  ngOnInit(): void {
  }

  update()
  {
    this.updateCustomer.emit(this.customerToDisplay);
  }

  delete()
  {
    this.deleteCustomer.emit(this.customerToDisplay);
  }

}
