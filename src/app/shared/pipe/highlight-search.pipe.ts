import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {

  transform(value: string, pattern: string): string
  {
    if(!pattern || pattern =='')
    { // No patterns to match
      return value;
    }
    // Create regex with the pattern and try matching with the input value
    const regex = new RegExp(pattern, 'gi');
    const match = value.match(regex);

    if(!match)
    { // Regex does not match with the value
      return value;
    }
    // Regex match! return the value with bold tags around the match
    return value.replace(regex, `<b>${match[0]}</b>`);
  }

}
