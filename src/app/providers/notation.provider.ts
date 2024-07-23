import { Injectable } from '@angular/core';

import { NotationData } from '@models/business';
import { AppUserService } from '../services/api/app-user.service';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class NotationProvider {
  private endpoints = {
    home: 'noter_reservation',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) {}

  noter(data) {
    return this.base.post<any>(this.endpoints.home, data, this.userPrv.getToken());
  }
}
