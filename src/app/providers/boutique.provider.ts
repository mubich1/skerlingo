import { Injectable } from '@angular/core';

import { BoutiqueData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class BoutiqueProvider {
  private endpoints = {
    home: 'boutique',
  };

  constructor(private base: BaseProvider) {}

  data() {
    return this.base.get<BoutiqueData>(this.endpoints.home);
  }
}
