import { Injectable } from '@angular/core';

import { Config } from '@config';

import { LoggerInterface } from './logger.interface';

const isDebugMode = !Config.production;
const noop = (): any => undefined;

@Injectable({
  providedIn: 'root',
})
export class ConsoleLoggerService implements LoggerInterface {
  constructor() {}

  get log() {
    if (isDebugMode) {
      return console.log.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  get trace() {
    if (isDebugMode) {
      return console.trace.bind(console);
    } else {
      return noop;
    }
  }

  get time() {
    if (isDebugMode) {
      return console.time.bind(console);
    } else {
      return noop;
    }
  }

  get timeEnd() {
    if (isDebugMode) {
      return console.timeEnd.bind(console);
    } else {
      return noop;
    }
  }

  get count() {
    if (isDebugMode) {
      return console.count.bind(console);
    } else {
      return noop;
    }
  }

  get assert() {
    if (isDebugMode) {
      return console.assert.bind(console);
    } else {
      return noop;
    }
  }

  get group() {
    if (isDebugMode) {
      return console.group.bind(console);
    } else {
      return noop;
    }
  }

  get groupEnd() {
    if (isDebugMode) {
      return console.groupEnd.bind(console);
    } else {
      return noop;
    }
  }

  get clear() {
    if (isDebugMode) {
      return console.clear.bind(console);
    } else {
      return noop;
    }
  }

  get table() {
    if (isDebugMode) {
      return console.table.bind(console);
    } else {
      return noop;
    }
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFn: Function = console[type] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
