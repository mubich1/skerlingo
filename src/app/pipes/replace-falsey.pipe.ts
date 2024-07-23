import { Pipe, PipeTransform } from '@angular/core';

/**
 * replace value if falsey
 * with given replacement (default: "-")
 */
@Pipe({ name: 'replaceFalsey' })
export class ReplaceFalseyPipe implements PipeTransform {
  constructor() {}

  /**
   * replace value if null or undefined
   * with given replacement (default: "-")
   */
  transform(value: string, replacement = '-'): string {
    if (!value) {
      return replacement;
    }

    return value;
  }
}
