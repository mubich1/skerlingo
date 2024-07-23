import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComparerService {
  constructor() {}

  /**
   * Simple sort comparer
   * @param a Base value
   * @param b Value to compare to
   * @param asc Asceding (default: true) or false for descending sort
   */
  public compare(a: number, b: number, asc: boolean = true) {
    return (a < b ? -1 : 1) * (asc ? 1 : -1);
  }

  /**
   * Simple sort comparer, attempts converting to number if possible
   * @param a Base value
   * @param b Value to compare to
   * @param asc Asceding (default: true) or false for descending sort
   */
  public compareAny(a: any, b: any, asc: boolean = true) {
    a = isNaN(a) ? a : +a;
    b = isNaN(b) ? b : +b;

    return (a < b ? -1 : 1) * (asc ? 1 : -1);
  }

  /**
   * Compare objects by property value
   * @param a Base object
   * @param b Object to compare to
   * @param selector Property to use for comparison
   * @param asc Asceding (default: true) or false for descending sort
   */
  public compareProperty<T>(a: T, b: T, selector: (i: T) => number, asc: boolean = true) {
    const av = selector(a);
    const bv = selector(b);

    return this.compare(av, bv, asc);
  }

  /**
   * Compare objects by property value, attempts converting to number if possible
   * @param a Base object
   * @param b Object to compare to
   * @param selector Property to use for comparison
   * @param asc Asceding (default: true) or false for descending sort
   */
  public comparePropertyAny<T>(a: T, b: T, selector: (i: T) => any, asc: boolean = true) {
    const av = selector(a);
    const bv = selector(b);

    return this.compareAny(av, bv, asc);
  }
}
