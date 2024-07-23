import { Injectable } from '@angular/core';

import {  SearchData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class SearchProvider {
  private endpoints = {
    home: 'search',
  };

  constructor(private base: BaseProvider) {}

  data() {
    return this.base.get<SearchData>(this.endpoints.home);
  }
}
