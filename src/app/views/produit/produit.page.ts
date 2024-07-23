import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProduitData } from '@models/business';
import { LoggerService } from '@services/utils';
import { ProduitProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';

import { AppReservationStorage } from '@services/security';

import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { ApiReservation } from '@models/security';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.page.html',
  styleUrls: ['./produit.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})

// implements OnInit
export class ProduitPage {
  private readonly TAG: string = 'ProduitPage';
  private idW: Watchable<number> = new Watchable<number>();
  private presW: Watchable<ProduitData> = new Watchable<ProduitData>();

  produit: ProduitData;
  reservationStorage = {} as ApiReservation;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 25,
    speed: 400,
  };

  constructor(
    private logger: LoggerService,
    private produitPrv: ProduitProvider,
    private reservationStrg: AppReservationStorage,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  // ngOnInit
  ionViewWillEnter() {
    //this.reservationStrg.clear();

    this.reservationStorage = this.reservationStrg.load();
    this.logger.log(this.TAG, 'init');

    this.route.params.subscribe((params) => {
      this.idW.value = params.id as number;
    });

    this.idW.observable
      .pipe(
        tap((id) => this.logger.log(this.TAG, 'id', id)),
        switchMap((id) => this.produitPrv.data(id)),
        tap((data) => this.logger.log(this.TAG, 'produit data', data)),
      )
      .subscribe(
        (data) => {
          this.presW.value = data;
        },
        (err) => console.log(JSON.stringify(err)),
      );

    this.presW.observable.subscribe((data) => (this.produit = data));
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  add_to_cart(produit) {
    console.log(this.reservationStorage.produits);
    let produitsMerge = this.reservationStorage.produits
      ? _.uniqBy([...[produit], ...this.reservationStorage.produits], 'id')
      : [produit];

    this.reservationStorage.produits = produitsMerge as [];

    this.reservationStrg.save(this.reservationStorage);
  }

  page_panier(produit) {
    console.log(this.reservationStorage.produits);
    let produitsMerge = this.reservationStorage.produits
      ? _.uniqBy([...[produit], ...this.reservationStorage.produits], 'id')
      : [produit];

    this.reservationStorage.produits = produitsMerge as [];

    this.reservationStrg.save(this.reservationStorage);

    this.router.navigate(['/tabs/panier']);
  }
}
