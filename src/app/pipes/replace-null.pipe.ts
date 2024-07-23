import { Pipe, PipeTransform } from '@angular/core';

/**
 * replace value if null or undefined
 * with given replacement (default: "-")
 */
@Pipe({ name: 'replaceNull' })
export class ReplaceNullPipe implements PipeTransform {
  constructor() {}

  /**
   * replace value if null or undefined
   * with given replacement (default: "-")
   */
  transform(value: string, replacement: string = '-'): string {
    if (value === null || typeof value === 'undefined') {
      return replacement;
    }

    return value;
  }
}
