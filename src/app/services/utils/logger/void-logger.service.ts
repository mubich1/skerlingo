import { Injectable } from '@angular/core';

import { LoggerInterface } from './logger.interface';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root',
})
export class VoidLoggerService implements LoggerInterface {
  constructor() {}

  get log() {
    return noop;
  }

  get info() {
    return noop;
  }

  get warn() {
    return noop;
  }

  get error() {
    return noop;
  }

  get trace() {
    return noop;
  }

  get time() {
    return noop;
  }

  get timeEnd() {
    return noop;
  }

  get profile() {
    return noop;
  }

  get count() {
    return noop;
  }

  get assert() {
    return noop;
  }

  get group() {
    return noop;
  }

  get groupEnd() {
    return noop;
  }

  get clear() {
    return noop;
  }

  get table() {
    return noop;
  }
}
