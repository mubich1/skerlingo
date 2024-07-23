import { Injectable } from '@angular/core';

import { PanierData } from '@models/business';

import { AppUserService } from '../services/api/app-user.service';
import { BaseProvider } from './base.provider';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';

import { ApiReservation } from '@models/security';

@Injectable({
  providedIn: 'root',
})
export class PanierProvider {
  private endpoints = {
    checkout: 'checkout',
    home: 'panier',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) {}

  data(prestations, produits) {
    const prestations_ids = _.map(prestations, _.iteratee('id'));
    const produits_ids = _.map(produits, _.iteratee('id'));

    return this.base.get<PanierData>(this.endpoints.checkout, {
      prestations: JSON.stringify(prestations_ids),
      produits: JSON.stringify(produits_ids),
    });
  }

  send(data) {
    let dataSend = { ...data };
    dataSend.prestations = _.map(dataSend.prestations, _.iteratee('id'));
    dataSend.produits = _.map(dataSend.produits, _.iteratee('id'));
    return this.base.post<ApiReservation>(this.endpoints.home, dataSend, this.userPrv.getToken());
  }
}
