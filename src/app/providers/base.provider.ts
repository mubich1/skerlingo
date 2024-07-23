import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError as _throw } from 'rxjs';

//AppUserService
import { ApiService } from '@services/api';
import { LoggerService } from '@services/utils';

@Injectable({
  providedIn: 'root',
})
export class BaseProvider {
  //, protected user: AppUserService
  constructor(protected logger: LoggerService, protected api: ApiService) {}

  public get<T>(url: string, params?: object, token?: string, cachecontrol: boolean = true): Observable<T> {
    if (params !== undefined) {
      let urlParams = new HttpParams(); // using fromObject parameter copies undefined properties, next lines ignores them
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => (urlParams = urlParams.append(key, v)));
          } else {
            urlParams = urlParams.append(key, value);
          }
        }
      });
      urlParams = urlParams.append('lang', window.localStorage['appLang']);
      if (urlParams.keys().length > 0) {
        url += '?' + urlParams.toString();
      }
    }

    return this.api.get<T>(url, cachecontrol, token);
  }

  public post<T>(url: string, data?: any, token?: string): Observable<T> {
    return this.api.post<T>(url, data, token);
  }
}
