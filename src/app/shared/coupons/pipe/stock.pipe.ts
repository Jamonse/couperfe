import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stock'
})
export class StockPipe implements PipeTransform {

  transform(value: number): string 
  {
    if(value > 1)
    {
      return value + ' In stock';
    }
    else if(value == 1)
    {
      return '<b class="one-left-color">Only one left!</b>';
    }
    else if(value == 0)
    {
      return '<b class="out-of-stock-color">Out of stock</b>';
    }
  }

}
