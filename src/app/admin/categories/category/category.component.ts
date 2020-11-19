import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Category } from 'src/app/core/model/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input()
  categoryToDisplay: Category;

  @Output()
  updateCategory: EventEmitter<Category> = new EventEmitter<Category>();

  @Output()
  deleteCategory: EventEmitter<Category> = new EventEmitter<Category>();

  constructor() { }

  ngOnInit(): void {
  }

  update()
  {
    this.updateCategory.emit(this.categoryToDisplay);
  }

  delete()
  {
    this.deleteCategory.emit(this.categoryToDisplay);
  }

}
