import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

import { RoundThousandsPipe } from '@pipes';

@Injectable({
  providedIn: 'root',
})
export class NumbersHandlerService {
  private decimalPipe: DecimalPipe;
  private percentPipe: PercentPipe;
  private roundThounsandsPipe: RoundThousandsPipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.decimalPipe = new DecimalPipe(locale);
    this.percentPipe = new PercentPipe(locale);
    this.roundThounsandsPipe = new RoundThousandsPipe(locale);
  }

  format(value: number, digits?: string): string {
    return this.decimalPipe.transform(value, digits);
  }

  percent(value: number, digits?: string): string {
    return this.percentPipe.transform(value, digits);
  }

  /**
   * round number to it's thousands equivalent
   * @param value number to be rounded
   * @param factor force rounding to: 3 (K), 6 (M), 9 (B), or any number N (EN)
   * @param digits
   * @param extension replace default extension, eg: "Md" instead of "B". should set factor
   */
  roundThounsands(date: number, factor?: number, extension?: string, digits?: string): string {
    return this.roundThounsandsPipe.transform(date, factor, extension, digits);
  }
}
