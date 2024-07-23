import { Injectable } from '@angular/core';

import { ProfilData } from '@models/business';

import { AppUserService } from '../services/api/app-user.service';
import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class ProfilProvider {
  private endpoints = {
    home: 'profil',
    annuler_res: 'annuler_reservation',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) {}

  data() {
    return this.base.get<ProfilData>(this.endpoints.home, {}, this.userPrv.getToken());
  }

  annuler_res(data) {
    return this.base.post<any>(this.endpoints.annuler_res, data, this.userPrv.getToken());
  }
}
