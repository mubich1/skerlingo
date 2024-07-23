import { Injectable } from '@angular/core';
import { HomeType, HomeData } from '@models/business';
import { BehaviorSubject } from 'rxjs';
import { AppUserService } from '../services/api/app-user.service';
import { BaseProvider } from './base.provider';

@Injectable({
  providedIn: 'root',
})

export class HomeProvider {
  readonly _kataProgressInfo = new BehaviorSubject<any>(null);
  readonly _HiraganaProgresstInfo = new BehaviorSubject<any>(null);

  private endpoints = {
    home: 'home',
    grid: 'grid',
    progress: 'progress',
    quiz: 'quiz',
    lecon: 'lecon',
    favorites: 'favorites',
    favorite: 'favorite',
    quiz_lettre: 'quiz_lettre',
    pays: 'pays',
    cgu: 'getCGUTitles',
    cgu_item: 'getCGUContent',
  };

  constructor(private base: BaseProvider, private userPrv: AppUserService) { }

  data(type: HomeType) {
    return this.base.get<HomeData>(this.endpoints.home, { view: type }, this.userPrv.getToken());
  }

  quiz(type: HomeType, content, lecon_id) {
    return this.base.get<HomeData>(this.endpoints.quiz, { type: type, content: content, lecon_id: lecon_id }, this.userPrv.getToken());
  }

  grid(id) {
    return this.base.get<any>(id ? this.endpoints.grid + '/' + id : this.endpoints.grid);
  }

  progress(id) {
    return this.base.get<any>(id ? this.endpoints.progress + '/' + id : this.endpoints.progress, {}, this.userPrv.getToken());
  }

  lecon(id) {
    return this.base.get<any>(this.endpoints.lecon, { id: id }, this.userPrv.getToken());
  }

  favorites() {
    return this.base.get<any>(this.endpoints.favorites, {}, this.userPrv.getToken());
  }

  favorite(data) {
    return this.base.post<any>(this.endpoints.favorite, data, this.userPrv.getToken());
  }

  quiz_lettre(data) {
    return this.base.post<any>(this.endpoints.quiz_lettre, data, this.userPrv.getToken());
  }

  pays() {
    return this.base.get<any>(this.endpoints.pays, {}, this.userPrv.getToken());
  }

  cgu() {
    let type = this.userPrv.getType();
    let endpoint = this.endpoints.cgu;
    let dataSend = {};
    dataSend['token'] = this.userPrv.getToken();
    if (type == '1') {
      endpoint = 'getCGUTitlesCandidat';
    }
    if (type == '2') {
      endpoint = 'getCGUTitlesRecruter';
    }

    return this.base.post<any>(endpoint, dataSend, this.userPrv.getToken());
  }

  cgu_item(id = null) {
    let type = this.userPrv.getType();
    let endpoint = this.endpoints.cgu_item;
    let dataSend = {};
    dataSend['token'] = this.userPrv.getToken();
    dataSend['id'] = "" + id;

    if (type == '1') {
      endpoint = 'getCGUContentCandidat';
    }
    if (type == '2') {
      endpoint = 'getCGUContentRecruter';
    }

    return this.base.post<any>(endpoint, dataSend, this.userPrv.getToken());
  }
}