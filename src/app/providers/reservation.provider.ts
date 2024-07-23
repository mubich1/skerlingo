import { Injectable } from '@angular/core';

import { ReservationData } from '@models/business';

import { BaseProvider } from './base.provider';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';

import { ApiReservation } from '@models/security';

@Injectable({
  providedIn: 'root',
})
export class ReservationProvider {
  private endpoints = {
    home: 'reservation',
  };

  constructor(private base: BaseProvider) {}

  data(prestations) {
    const ids = _.map(prestations, _.iteratee('id'));

    return this.base.get<ReservationData>(this.endpoints.home, { prestations: JSON.stringify(ids) });
  }

  send(data) {
    data.prestations = _.map(data.prestations, _.iteratee('id'));

    return this.base.post<ApiReservation>(this.endpoints.home, data);
  }
}
