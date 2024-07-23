import { Injectable } from '@angular/core';

import { DemandesData, EtapeData } from '@models/business';

import { AppUserService } from '../services/api/app-user.service';
import { BaseProvider } from './base.provider';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { Config } from '@config';
import { EtapesData } from '@models/business/etapes';

@Injectable({
  providedIn: 'root',
})
export class DemandesProvider {
  private endpoints = {
    home: 'demandes',
    etapes: 'etapes',
    etape: 'etape',
    send_message: 'send_message',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) {
  }

  data() {
    let dataSend = {};
    dataSend['token'] =this.userPrv.getToken();

    return this.base.get<DemandesData>(this.endpoints.home, dataSend, this.userPrv.getToken());
  }

  etapes(id) {
    return this.base.get<EtapesData>(this.endpoints.etapes+ '/' + id, {}, this.userPrv.getToken());
  }

  etape(id) {
    return this.base.get<EtapeData>(this.endpoints.etape+ '/' + id, {}, this.userPrv.getToken());
  }

  send_message(data) {
    return this.base.post<any>(this.endpoints.send_message, data, this.userPrv.getToken());
  }

  
}
