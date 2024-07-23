import { Injectable } from '@angular/core';

import { ProduitData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class ProduitProvider {
  private endpoints = {
    home: 'produit',
  };

  constructor(private base: BaseProvider) {}

  data(id) {
    return this.base.get<ProduitData>(this.endpoints.home + '/' + id);
  }
}
