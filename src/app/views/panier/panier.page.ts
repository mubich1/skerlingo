import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { LoggerService } from '@services/utils';
import { AppReservationStorage } from '@services/security';
import { PanierProvider } from '@providers';
import { ApiReservation } from '@models/security';

import * as moment from 'moment';
import { PanierData } from '@models/business';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.page.html',
  styleUrls: ['./panier.page.scss'],
})
export class PanierPage {
  private readonly TAG: string = 'Panier Page';

  reservationStorage: ApiReservation;
  data: PanierData;

  constructor(
    private logger: LoggerService,
    public alertController: AlertController,
    private reservationStrg: AppReservationStorage,
    private panierPrv: PanierProvider,
    private nav: NavController,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ionViewWillEnter() {
    this.reservationStorage = this.reservationStrg.load();
    this.logger.log(this.TAG, 'init');

    this.send_data();
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  edit_reservation() {
    this.router.navigate(['/tabs/home/reservation']);
  }

  send_data() {
    this.panierPrv.send(this.reservationStorage).subscribe(
      (res) => {
        this.logger.log(this.TAG, 'send reservation data', res);
        this.reservationStrg.clear();
        this.alertDone(res);
        this.nav.navigateRoot('/tabs/demandes');
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  async alertDone(res) {
    const alert = await this.alertController.create({
      cssClass: 'chic-choc-alert',
      header: res.title,
      message: res.message,
      buttons: ['Fermer'],
    });

    await alert.present();
  }

  deleteProduit(produit) {
    this.reservationStorage.produits = this.reservationStorage.produits.filter((item) => item.id !== produit.id);
    this.reservationStorage.total -= produit.prix;
    this.reservationStrg.save(this.reservationStorage);
  }
}
