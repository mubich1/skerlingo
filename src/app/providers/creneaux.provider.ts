import { Injectable } from '@angular/core';

import { CreneauxData } from '@models/business';

import { BaseProvider } from './base.provider';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CreneauxProvider {
  private endpoints = {
    home: 'creneaux',
  };

  constructor(private base: BaseProvider) {}

  data(membre, duree, prestations) {
    const ids = _.map(prestations, _.iteratee('id'));

    return this.base.get<CreneauxData>(this.endpoints.home, {
      membre: membre,
      duree: duree,
      prestations: JSON.stringify(ids),
    });
  }
}
