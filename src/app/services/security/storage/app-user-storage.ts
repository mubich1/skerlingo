import { Injectable } from '@angular/core';

import { ApiUser } from '@models/security';
import { LoggerService } from '@services/utils';

@Injectable({
  providedIn: 'root',
})
export class AppUserStorage {
  static USER_KEY = '_user';

  constructor(private logger: LoggerService) {}

  load(): ApiUser {
    const value = window.localStorage[AppUserStorage.USER_KEY];

    if (!value) {
      return undefined;
    }

    try {
      const stored = JSON.parse(value) as ApiUser;
      return stored;
    } catch (e) {
      this.logger.log(e);
    }

    return undefined;
  }

  save(user: ApiUser): void {
    const userValue = JSON.stringify(user);
    window.localStorage[AppUserStorage.USER_KEY] = userValue;
  }

  clear(): void {
    window.localStorage.removeItem(AppUserStorage.USER_KEY);
  }
}
