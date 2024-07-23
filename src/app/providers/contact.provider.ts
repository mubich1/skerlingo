import { Injectable } from '@angular/core';

import {  ContactData } from '@models/business';

import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})
export class ContactProvider {
  private endpoints = {
    home: 'contact',
  };

  constructor(private base: BaseProvider) {}

  data() {
    return this.base.get<ContactData>(this.endpoints.home);
  }
}
