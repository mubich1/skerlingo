import { Injectable } from '@angular/core';

import { ApiReservation } from '@models/security';
import { LoggerService } from '@services/utils';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppReservationStorage {
  static RES_KEY = '_reservation';

  countPanierChange: Subject<any> = new Subject<any>();

  constructor(private logger: LoggerService) {}

  load(): ApiReservation {
    const value = window.localStorage[AppReservationStorage.RES_KEY];

    if (!value) {
      return {} as ApiReservation;
    }

    try {
      const stored = JSON.parse(value) as ApiReservation;
      const countPanier =
        (stored.prestations ? stored.prestations.length : 0) + (stored.produits ? stored.produits.length : 0);
      this.countPanierChange.next(countPanier > 0 ? countPanier : null);
      return stored;
    } catch (e) {
      this.logger.log(e);
    }

    return {} as ApiReservation;
  }

  save(reservation: ApiReservation): void {
    const reservationValue = JSON.stringify(reservation);
    const countPanier =
      (reservation.prestations ? reservation.prestations.length : 0) +
      (reservation.produits ? reservation.produits.length : 0);
    this.countPanierChange.next(countPanier > 0 ? countPanier : null);
    window.localStorage[AppReservationStorage.RES_KEY] = reservationValue;
  }

  clear(): void {
    this.countPanierChange.next(null);
    window.localStorage.removeItem(AppReservationStorage.RES_KEY);
  }
}
