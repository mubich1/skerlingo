import { Injectable } from '@angular/core';

import { ConsoleLoggerService } from './console-logger.service';

type func = (...params: any) => void;

@Injectable({
  providedIn: 'root',
  useClass: ConsoleLoggerService,
})
export abstract class LoggerInterface {
  log: func;
  info: func;
  warn: func;
  error: func;
  trace: func;
  time: func;
  timeEnd: func;
  count: func;
  assert: func;
  group: func;
  groupEnd: func;
  clear: func;
  table: func;
}
