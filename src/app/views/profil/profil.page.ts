import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AppReservationStorage } from '@services/security';
import { ProfilData } from '@models/business';
import { LoggerService } from '@services/utils';
import { ProfilProvider } from '@providers';
import { ApiReservation } from '@models/security';

import { NotationPage } from '../notation/notation.page';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss'],
})

//  implements OnInit, OnDestroy
export class ProfilPage {
  private readonly TAG: string = 'ProfilPage';

  scrollDepthTriggered = false;
  slidePrestationsOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 25,
    speed: 400,
  };
  slideRessOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 25,
    speed: 400,
  };
  data: ProfilData;
  reservationStorage: ApiReservation;
  segmentModel = 'reservations';

  constructor(
    private logger: LoggerService,
    private profilPrv: ProfilProvider,
    private reservationStrg: AppReservationStorage,
    private modalCtrl: ModalController,
    private router: Router,
    public actionSheetController: ActionSheetController,
  ) {}

  // ngOnInit
  ionViewWillEnter() {
    this.reservationStorage = this.reservationStrg.load();

    this.logger.log(this.TAG, 'init');

    this.profilPrv.data().subscribe(
      (res) => {
        this.logger.log(this.TAG, 'profil data', res);
        this.data = res;
      },
      (err) => {
        this.router.navigate(['/tabs/profil/login']);
        console.log(JSON.stringify(err));
      },
    );
  }

  segmentChanged(event) {}

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 0) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }

  reserver() {
    this.router.navigate(['/tabs/home']);
  }

  compte() {
    this.router.navigate(['/tabs/profil/compte']);
  }

  async presentActionSheet(reservation) {
    let buttons = [];
    if (reservation.editable) {
      buttons.push({
        text: 'Modifier la réservation',
        icon: 'create-outline',
        handler: () => {
          console.log('Modifier la reservation clicked');
          this.reservationStorage.prestations = reservation.prestations;
          this.reservationStorage.id = reservation.id;
          this.reservationStorage.date = reservation.date;
          this.reservationStorage.heure = reservation.heure;
          this.reservationStrg.save(this.reservationStorage);
          this.router.navigate(['/tabs/home/reservation']);
        },
      });
    }

    if (reservation.annulable) {
      buttons.push({
        text: 'Annuler la réservation',
        icon: 'remove-outline',
        handler: async function () {
          this.profilPrv.annuler_res({ reservation: reservation.id }).subscribe(
            (res) => {
              this.logger.log(this.TAG, 'Annuler reservation data', res);
              // Update if reservation is the next Reservation
              let updateItem = this.data.next_reservation.find((x) => x.id == res.reservation.id);
              let index = this.data.next_reservation.indexOf(updateItem);
              if (index >= 0) {
                this.data.next_reservation[index] = res.reservation;
              }

              // Search in reservations array and update
              updateItem = this.data.reservations.find((x) => x.id == res.reservation.id);
              index = this.data.reservations.indexOf(updateItem);
              if (index >= 0) {
                this.data.reservations[index] = res.reservation;
              }
            },
            (err) => console.log(JSON.stringify(err)),
          );
        }.bind(this),
      });
    }

    if (reservation.evaluable) {
      buttons.push({
        text: 'Evaluer la réservation',
        icon: 'heart',
        handler: async function () {
          console.log('Favorite clicked');
          const modal = await this.modalCtrl.create({
            component: NotationPage,
            cssClass: 'my-custom-class',
            componentProps: {
              reservation: reservation,
            },
          });
          await modal.present();
          await modal.onDidDismiss().then((result) => {
            if (result.data?.done) {
              // Update if reservation is the next Reservation
              let updateItem = this.data.next_reservation.find((x) => x.id == result.data.reservation.id);
              let index = this.data.next_reservation.indexOf(updateItem);
              if (index >= 0) {
                this.data.next_reservation[index] = result.data.reservation;
              }

              // Search in reservations array and update
              updateItem = this.data.reservations.find((x) => x.id == result.data.reservation.id);
              index = this.data.reservations.indexOf(updateItem);
              if (index >= 0) {
                this.data.reservations[index] = result.data.reservation;
              }
            }
          });
        }.bind(this),
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: buttons,
    });
    await actionSheet.present();
  }
}
