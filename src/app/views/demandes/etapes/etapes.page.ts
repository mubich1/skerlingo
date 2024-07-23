import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AppReservationStorage } from '@services/security';
import { LoggerService } from '@services/utils';
import { DemandesProvider, ProfilProvider } from '@providers';
import { ApiReservation } from '@models/security';

import * as moment from 'moment';

import { async } from '@angular/core/testing';
import { AppUserService } from '@services/api/app-user.service';
import { DemandesData, EtapesData } from '@models/business';

@Component({
  selector: 'app-etapes',
  templateUrl: 'etapes.page.html',
  styleUrls: ['etapes.page.scss'],
})

//  implements OnInit, OnDestroy
export class EtapesPage {
  private readonly TAG: string = 'EncoursPage';

  scrollDepthTriggered = false;
  id: any;
  alias: any;
  title: any;
  no_data_title: any;
  no_data_description: any;
  data: EtapesData;
  user: any;

  segmentModel = 'etapes';

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

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        if(this.router.getCurrentNavigation().extras.state.id)
          this.id= this.router.getCurrentNavigation().extras.state.id;

        this.title= this.router.getCurrentNavigation().extras.state.title;
      }
    });

  }

  // ngOnInit
  ionViewWillEnter() {

    this.logger.log(this.TAG, 'init');

    if(!this.id){
      this.router.navigate(['/tabs/demandes']);
    }

    this.demandesPrv.etapes(this.id).subscribe(
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

  etape_page(etape) {
    let navigationExtras: NavigationExtras = { state: { id: etape.id, title: etape.label } };
    this.router.navigate(['/etape'], navigationExtras);
  }
  
}
