import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'button, a'
})
export class RemoveFocusDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click')
  onClick()
  {
    this.elementRef.nativeElement.blur();
  }

}
