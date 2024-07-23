import { Injectable } from '@angular/core';

import { CategorieData, PrestationData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class PrestationProvider {
  private endpoints = {
    home: 'lecons',
    introduction: 'lecons_introduction',
  };

  constructor(private base: BaseProvider) { }

  data(id) {
    return this.base.get<CategorieData>(this.endpoints.home, {
      type: id
    });
  }

  introduction(id) {
    return this.base.get<CategorieData>(id ? this.endpoints.introduction + '/' + id : this.endpoints.introduction);
  }
}