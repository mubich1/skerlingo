import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ReservationData } from '@models/business';
import { LoggerService } from '@services/utils';
import { AppReservationStorage } from '@services/security';
import { ReservationProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';
import { ApiReservation } from '@models/security';

import * as moment from 'moment';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})

// implements OnInit
export class ReservationPage {
  private readonly TAG: string = 'ReservationPage';
  private idW: Watchable<any> = new Watchable<any>();
  private resW: Watchable<ReservationData> = new Watchable<ReservationData>();

  reservation: ReservationData;
  reservationStorage: ApiReservation;

  constructor(
    private logger: LoggerService,
    private reservationPrv: ReservationProvider,
    private reservationStrg: AppReservationStorage,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  //ngOnInit
  ionViewWillEnter() {
    this.reservationStorage = this.reservationStrg.load();

    this.logger.log(this.TAG, 'init');

    if (this.reservationStorage.prestations.length == 0) {
      this.router.navigate(['/']);
      return false;
    }

    this.idW.value = this.reservationStorage.prestations as any;
    this.idW.observable
      .pipe(
        tap((id) => this.logger.log(this.TAG, 'id', id)),
        switchMap((id) => this.reservationPrv.data(this.reservationStorage.prestations)),
        tap((data) => this.logger.log(this.TAG, 'reservation data', data)),
      )
      .subscribe(
        (data) => {
          this.resW.value = data;
          this.reservationStorage.prestations = data.prestations;
          this.reservationStorage.duree = data.duree;
          this.reservationStorage.prix = data.prix;
          if(!this.reservationStorage.membre)
            this.reservationStorage.membre = 'sans';
          this.reservationStrg.save(this.reservationStorage);
        },
        (err) => console.log(JSON.stringify(err)),
      );

    this.resW.observable.subscribe((data) => {
      this.reservation = data;
    });
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  dateRdv(event) {
    this.reservationStorage.date = moment(event.detail.value).format('YYYY-MM-DD');
  }

  heureRdv(event) {
    this.reservationStorage.heure = moment(event.detail.value).format('HH:mm');
  }

  membreRdv(event) {
    this.reservationStorage.membre = event.detail.value;
  }

  deletePrestation(prestation) {
    this.reservationStorage.prestations = this.reservationStorage.prestations.filter(
      (item) => item.id !== prestation.id,
    );

    this.reservationStrg.save(this.reservationStorage);

    if (this.reservationStorage.prestations.length == 0) {
      this.router.navigate(['/']);
      return false;
    }

    this.idW.value = this.reservationStorage.prestations as any;
  }

  creneaux() {
    this.reservationStrg.save(this.reservationStorage);
    this.idW.complete();
    this.router.navigate(['/tabs/home/creneaux']);
  }

  panier() {
    this.reservationStrg.save(this.reservationStorage);
    this.router.navigate(['/tabs/panier']);
  }

  home_page() {
    this.router.navigate(['/tabs/home']);
  }
}
