import { Injectable } from '@angular/core';

import { CategorieData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class CategorieProvider {
  private endpoints = {
    home: 'categorie',
  };

  constructor(private base: BaseProvider) {}

  data(id) {
    return this.base.get<CategorieData>(this.endpoints.home + '/' + id);
  }
}
