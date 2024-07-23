import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AppReservationStorage } from '@services/security';
import { LoggerService } from '@services/utils';
import { DemandesProvider, ProfilProvider } from '@providers';
import { ApiReservation } from '@models/security';

import * as moment from 'moment';

import { NotationPage } from '../notation/notation.page';
import { async } from '@angular/core/testing';
import { AppUserService } from '@services/api/app-user.service';
import { DemandesData } from '@models/business';

@Component({
  selector: 'app-demandes',
  templateUrl: 'demandes.page.html',
  styleUrls: ['demandes.page.scss'],
})

//  implements OnInit, OnDestroy
export class DemandesPage {
  private readonly TAG: string = 'EncoursPage';

  scrollDepthTriggered = false;
  alias: any;
  title: any;
  no_data_title: any;
  no_data_description: any;
  data: DemandesData;
  user: any;

  segmentModel = 'service';

  constructor(
    private logger: LoggerService,
    private demandesPrv: DemandesProvider,
    private reservationStrg: AppReservationStorage,
    private appUserService: AppUserService,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
  ) {
    
    this.user = this.appUserService.getUser();

  }

  // ngOnInit
  ionViewWillEnter() {

    this.logger.log(this.TAG, 'init');

    this.demandesPrv.data().subscribe(
      (res) => {
        this.logger.log(this.TAG, 'profil data', res);
        this.data = res;
      },
      (err) => {
        //this.router.navigate(['/tabs/profil/login']);
        console.log(JSON.stringify(err));
      },
    );
  }
  
  refresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }

  locationPicked(value) {
    console.log('test', value)
  }

  segmentChanged(event) {
    //this.keywords.selected
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  onTypeEmitted(type) {
    // do something with 'type'
    console.log(type);
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 0) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }

  etapes_page(demande) {
    if(!demande.etape_id){
      let navigationExtras: NavigationExtras = { state: { id: demande.id, title: demande.service_label } };
      this.router.navigate(['/etapes'], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = { state: { id: demande.etape_id, title: demande.service_label, service: true } };
      this.router.navigate(['/etape'], navigationExtras);
    }
  }
  
}
