import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CreneauxData } from '@models/business';
import { LoggerService } from '@services/utils';
import { CreneauxProvider } from '@providers';
import { IonSlides } from '@ionic/angular';
import { ApiReservation } from '@models/security';
import { AppReservationStorage } from '@services/security';

@Component({
  selector: 'app-creneaux',
  templateUrl: 'creneaux.page.html',
  styleUrls: ['creneaux.page.scss'],
})
export class CreneauxPage implements OnInit, OnDestroy {
  private readonly TAG: string = 'CreneauxPage';

  @ViewChild('slideCalendar') slideCalendar: IonSlides;

  data: CreneauxData;
  reservationStorage: ApiReservation;
  periodes: any;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 25,
    speed: 400,
  };

  constructor(
    private logger: LoggerService,
    private creneauxPrv: CreneauxProvider,
    private router: Router,
    private reservationStrg: AppReservationStorage,
  ) {}

  ngOnInit() {
    this.reservationStorage = this.reservationStrg.load();

    this.logger.log(this.TAG, 'init');

    this.creneauxPrv
      .data(this.reservationStorage.membre, this.reservationStorage.duree, this.reservationStorage.prestations)
      .subscribe(
        (res) => {
          this.logger.log(this.TAG, 'creneaux data', res);
          this.data = res;

          const firstDayOfFirstWeek = this.data.calendar[0]['week'][0];

          this.reservationStorage.date = firstDayOfFirstWeek['date'];
          this.reservationStorage.heure = null;
          this.periodes = firstDayOfFirstWeek['periodes'];
        },
        (err) => console.log(JSON.stringify(err)),
      );
  }

  slidePrev() {
    this.slideCalendar.slidePrev();
    this.reseteDate();
  }

  slideNext() {
    this.slideCalendar.slideNext();
    this.reseteDate();
  }

  dateRdv(date) {
    this.reservationStorage.date = date.date;
    this.reservationStorage.heure = null;
    this.periodes = date.periodes;
  }

  reseteDate() {
    this.reservationStorage.date = null;
    this.reservationStorage.heure = null;
    this.periodes = null;
  }

  timeRdv(creneau) {
    this.reservationStorage.heure = creneau;
  }

  panier() {
    this.reservationStrg.save(this.reservationStorage);
    this.router.navigate(['/tabs/panier']);
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }
}
