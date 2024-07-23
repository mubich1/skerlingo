import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AppUserService } from '../../services/api/app-user.service';
import { GiveawayData } from '@models/business';
import { LoggerService } from '@services/utils';
import { GiveawayProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';

import { AppReservationStorage } from '@services/security';

import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { ApiReservation } from '@models/security';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.page.html',
  styleUrls: ['./giveaway.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})

// implements OnInit
export class GiveawayPage {
  private readonly TAG: string = 'GiveawayPage';
  private idW: Watchable<number> = new Watchable<number>();

  giveaway: GiveawayData;
  loggedIn: boolean;
  reservationStorage = {} as ApiReservation;
  CountdownTimeUnits: Array<[string, number]> = [
    ['Y', 1000 * 60 * 60 * 24 * 365], // years
    ['M', 1000 * 60 * 60 * 24 * 30], // months
    ['D', 1000 * 60 * 60 * 24], // days
    ['H', 1000 * 60 * 60], // hours
    ['m', 1000 * 60], // minutes
    ['s', 1000], // seconds
    ['S', 1], // million seconds
  ];
  prettyConfig: CountdownConfig = {
    leftTime: 0,
    format: 'HH:mm:ss',
    formatDate: ({ date, formatStr }) => {
      let duration = Number(date || 0);

      return this.CountdownTimeUnits.reduce((current, [name, unit]) => {
        if (current.indexOf(name) !== -1) {
          const v = Math.floor(duration / unit);
          duration -= v * unit;
          return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
            return v.toString().padStart(match.length, '0');
          });
        }
        return current;
      }, formatStr);
    },
    prettyText: (text) => {
      return (
        '<span class="item_text">Tirage gagnants</span>' +
        text
          .split(':')
          .map((v) =>
            v
              .split('')
              .map((time) => `<span class="item_time">${time}</span>`)
              .join(''),
          )
          .join('<span class="item_split_time">:</span>') +
        `<span class="item_text_time"><span>heures</span><span>minutes</span><span>secondes</span></span>`
      );
    },
  };

  constructor(
    private logger: LoggerService,
    private giveawayPrv: GiveawayProvider,
    private userPrv: AppUserService,
    public alertController: AlertController,
    private reservationStrg: AppReservationStorage,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // ngOnInit
  ionViewWillEnter() {
    //this.reservationStrg.clear();
    this.loggedIn = this.userPrv.isLoggedIn();

    this.reservationStorage = this.reservationStrg.load();
    this.logger.log(this.TAG, 'init');

    this.route.params.subscribe((params) => {
      this.giveawayPrv.data(params.id).subscribe(
        (res) => {
          this.logger.log(this.TAG, 'home data', res);
          this.giveaway = res;
          this.prettyConfig.leftTime = this.giveaway.counter;
        },
        (err) => console.log(JSON.stringify(err)),
      );
    });
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  page_login(giveaway) {
    this.router.navigate([
      '/tabs/profil/login',
      {
        snapshot: '/tabs/home/giveaway',
        snapshot_id: giveaway.id,
      },
    ]);
  }

  participer(giveaway) {
    this.giveawayPrv.participer({ giveaway: giveaway.id }).subscribe(
      (res) => {
        this.logger.log(this.TAG, 'send reservation data', res);
        this.giveaway = res;
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }
}
