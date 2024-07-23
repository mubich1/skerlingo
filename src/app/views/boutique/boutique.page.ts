import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { BoutiqueData } from '@models/business';
import { LoggerService } from '@services/utils';
import { BoutiqueProvider } from '@providers';

import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { ApiReservation } from '@models/security';
import { AppReservationStorage } from '@services/security';

@Component({
  selector: 'app-boutique',
  templateUrl: 'boutique.page.html',
  styleUrls: ['boutique.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})
export class BoutiquePage implements OnInit, OnDestroy {
  private readonly TAG: string = 'BoutiquePage';

  scrollDepthTriggered = false;

  data: BoutiqueData;
  reservationStorage = {} as ApiReservation;
  categorie: any;
  produits: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3.4,
    spaceBetween: 25,
    speed: 400,
  };
  slideProduitsOpts = {
    initialSlide: 0,
    slidesPerView: 1.7,
    spaceBetween: 25,
    speed: 400,
  };

  constructor(
    private logger: LoggerService,
    private homePrv: BoutiqueProvider,
    public alertController: AlertController,
    private router: Router,
    private reservationStrg: AppReservationStorage,
  ) {}

  ngOnInit() {
    this.reservationStorage = this.reservationStrg.load();
    this.logger.log(this.TAG, 'init');

    this.homePrv.data().subscribe(
      (res) => {
        this.logger.log(this.TAG, 'home data', res);
        this.data = res;
        this.categorie = this.data.categories ? this.data.categories[0] : null;
        if (this.categorie) {
          this.produits = this.data.produits.filter((x) => x.categorie_id == this.categorie.id);
        }
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  segmentChanged($event) {
    console.log();
    if (this.categorie) {
      this.produits = this.data.produits.filter((x) => x.categorie_id == $event.detail.value);
    }
  }

  page_produit(produit) {
    this.router.navigate([
      '/tabs/boutique/produit',
      {
        id: produit.id,
      },
    ]);
  }

  async add_to_cart(produit) {
    let produitsMerge = this.reservationStorage.produits
      ? _.uniqBy([...[produit], ...this.reservationStorage.produits], 'id')
      : [produit];

    this.reservationStorage.produits = produitsMerge as [];

    this.reservationStrg.save(this.reservationStorage);

    const alert = await this.alertController.create({
      cssClass: 'chic-choc-alert',
      header: produit.label + ' a bien été ajouté !',
      message: produit.label + ' a bien été ajouté !',
      buttons: [
        {
          text: 'Finaliser la commande',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigate(['/tabs/panier']);
          },
        },
        {
          text: 'Poursuivre vos achats',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }
}
