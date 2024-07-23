import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DatesHandlerService {
  private datePipe: DatePipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.datePipe = new DatePipe(locale);
  }

  format(date: Date | number, format?: string): string {
    return this.datePipe.transform(date, format);
  }

  getMonthName(date: Date | number): string {
    return this.format(date, 'LLLL');
  }

  getMonthNameShort(date: Date | number): string {
    return this.format(date, 'LLL');
  }
}
