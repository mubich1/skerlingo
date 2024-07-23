import { Injectable } from '@angular/core';

import { GiveawayData } from '@models/business';
import { AppUserService } from '../services/api/app-user.service';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class GiveawayProvider {
  private endpoints = {
    home: 'giveaway',
    participer: 'giveaway_participate',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) {}

  data(id) {
    return this.base.get<GiveawayData>(this.endpoints.home + '/' + id, {}, this.userPrv.getToken());
  }

  participer(data) {
    return this.base.post<any>(this.endpoints.participer, data, this.userPrv.getToken());
  }
}
