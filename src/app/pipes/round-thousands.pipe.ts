import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * round number to it's thousands equivalent
 * eg: 8376814 => 8.4 M
 */
@Pipe({ name: 'roundThousands' })
export class RoundThousandsPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   * round number to it's thousands equivalent
   * @param value number to be rounded
   * @param factor force rounding to: 3 (K), 6 (M), 9 (B), or any number N (EN)
   * @param digits
   * @param extension replace default extension, eg: "Md" instead of "B". should set factor
   */
  transform(value: number, factor?: number, extension?: string, digits?: string) {
    if (this.isEmpty(value)) {
      // From Number Pipes source
      return null;
    }

    if (!factor) {
      const absValue = Math.abs(value);
      if (absValue > 1e9) {
        factor = 9;
      } else if (absValue > 1e6) {
        factor = 6;
      } else if (absValue > 1e3) {
        factor = 3;
      } else {
        factor = 0;
      }
    }

    const divider = Math.pow(10, factor);

    if (!extension) {
      if (factor === 9) {
        extension = ' B';
      } else if (factor === 6) {
        extension = ' M';
      } else if (factor === 3) {
        extension = ' K';
      } else if (factor === 0) {
        extension = '';
      } else {
        extension = 'E' + factor;
      }
    }

    const result = value / divider;

    if (!digits) {
      digits = '1.0-0';
      if (value !== 0 && Math.round(Math.abs(result)) < 10) {
        // Math.Round for when it's closer to 10 than to 9
        digits = '1.1-1';
      }
    }

    return new DecimalPipe(this._locale).transform(result, digits) + extension;
  }

  // From Number Pipes source
  private isEmpty(value: any): boolean {
    return value == null || value === '' || value !== value;
  }
}
