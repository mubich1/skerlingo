import { Observable, ReplaySubject } from 'rxjs';

/**
 * Wrapper to watch if a value is set/updated
 */
export class Watchable<T> {
  private _value: T;
  private _subject: ReplaySubject<T>;

  /**
   * initialise watchable instance
   * @param initialValue optional inital value
   */
  constructor(initialValue?: T) {
    this._subject = new ReplaySubject(1);
    if (initialValue === void 0) {
      this.value = initialValue;
    }
  }

  /**
   * get/set value
   */
  get value(): T {
    return this._value;
  }
  set value(v: T) {
    this._value = v;
    this._subject.next(this._value);
  }

  /**
   * observable on value
   * submits on subscribe if value was set before
   */
  get observable(): Observable<T> {
    return this._subject.asObservable();
  }

  /**
   * Complete the watch instance to free observable/subscriptions
   */
  complete(): void {
    this._subject.complete();
  }
}

/**
 * Same concept as here
 * Uses @Watchable attribute, so doesn't required initialisation
 * https://github.com/footageone/watchable
 */
