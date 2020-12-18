import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[matTooltip][appTooltipIfTuncated]'
})
export class TooltipIfTuncatedDirective {

  constructor(
    private matTooltip: MatTooltip,
    private elementRef: ElementRef
  ) { }

  @HostListener('mouseenter')
  initTooltip()
  {
    const element = this.elementRef.nativeElement;
    this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
  }
  

}
