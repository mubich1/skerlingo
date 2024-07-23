import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CategorieData, PrestationData } from '@models/business';
import { LoggerService } from '@services/utils';
import { PrestationProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';
import { AppReservationStorage } from '@services/security';
import { uniqBy } from 'lodash';
import * as _ from 'lodash';
import { ApiReservation } from '@models/security';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NotationPage } from '@views/notation/notation.page';
import { lessonMenuDetails } from './static-record';

@Component({
  selector: 'app-prestation',
  templateUrl: './prestation.page.html',
  styleUrls: ['./prestation.page.scss'],
  encapsulation: ViewEncapsulation.None, // added
})

export class PrestationPage {
  private readonly TAG: string = 'PrestationPage';
  private idW: Watchable<number> = new Watchable<number>();
  private presW: Watchable<PrestationData> = new Watchable<PrestationData>();
  data: CategorieData;
  categorie: any;
  prestation: PrestationData;
  reservationStorage = {} as ApiReservation;
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 1,
    spaceBetween: 25,
    speed: 400,
  };

  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    title: {
      fr: 'J’apprends',
      en: 'Lessons'
    },
    title_desc_hiragana: {
      fr: 'Choisissez un groupe  et commencer à apprendre les hiraganas !',
      en: 'Choose a lesson and start your hiragana learning quest!'
    },
    title_desc_katakana: {
      fr: 'Choisissez un groupe  et commencer à apprendre le katakana !',
      en: 'Choose a lesson and start your katakana learning quest!'
    },
  };

  public formGroup: FormGroup;
  public prix: any;
  public delai: number;
  public message: any;
  public demande_specifique: any;
  errors: any = [];

  constructor(
    private logger: LoggerService,
    private prestationPrv: PrestationProvider,
    private reservationStrg: AppReservationStorage,
    private modalCtrl: ModalController,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {

    this.formGroup = this.formBuilder.group({
      message: ['', Validators.nullValidator],
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state.demande_specifique)
          this.demande_specifique = true;
      }
    });
  }

  ionViewWillEnter() {
    //this.reservationStrg.clear();
    this.route.params.subscribe((params) => {
      this.categorie = params.id;
    });

    this.currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
    // to unlock next lessopn on lesson completion
    const res: CategorieData = lessonMenuDetails.find((lesson) => lesson.type == this.categorie);
    this.logger.log(this.TAG, 'home data', res);
    let cadena = 0;
    res.lecons.forEach(element => {
      if (cadena < 1 && !window.localStorage[this.categorie + '_' + element.id] && (element.letter || element.additionalCount)) {
        element.cadena = false;
        cadena++;
      } else {
        if ((element.letter || element.additionalCount) && !window.localStorage[this.categorie + '_' + element.id])
          element.cadena = true;
        else
          element.cadena = false;
      }
    });

    this.data = res;
    // this.prestationPrv.data(this.categorie).subscribe(
    //   async (res) => {
    //     this.logger.log(this.TAG, 'home data', res);

    //     let cadena = 0;
    //     res.lecons.forEach(element => {
    //       if(cadena < 1 && !window.localStorage[this.categorie+'_'+element.id] && element.letter){
    //         element.cadena = false;
    //         cadena++;
    //       }else {
    //         if(element.letter && !window.localStorage[this.categorie+'_'+element.id])
    //           element.cadena = true;
    //         else
    //           element.cadena = false;
    //       }
    //     });

    //     this.data = res;
    //     console.log('this.data', this.data);

    //   },
    //   (err) => console.log(JSON.stringify(err)),
    // );

    /*

    this.idW.observable
      .pipe(
        tap((id) => this.logger.log(this.TAG, 'id', id)),
        switchMap((id) => this.prestationPrv.data(id)),
        tap((data) => this.logger.log(this.TAG, 'prestation data', data)),
      )
      .subscribe(
        (data) => {
          this.presW.value = data;
        },
        (err) => console.log(JSON.stringify(err)),
      );

    this.presW.observable.subscribe((data) => {
        this.prestation = data;
        if(this.prestation) {
          if(this.prestation.id) {
            this.prix  = this.prestation.montant ? this.prestation.montant : 0;
            this.delai  = this.prestation.time_to_deliver;
            this.prestation.questions.forEach(element => {
                const control: FormControl = new FormControl('' , element.required?Validators.required:Validators.nullValidator);
                this.formGroup.addControl('question_'+element.id, control);
            });
          }
          if(this.demande_specifique){
            const control: FormControl = new FormControl('' , Validators.required);
            this.formGroup.addControl('rubrique', control);
          }
        }
    });
    */
  }

  getIfDone(lecon_id) {
    return window.localStorage[this.categorie + '_' + lecon_id];
  }

  page_grid() {
    let navigationExtras: NavigationExtras = { state: { id: this.categorie, title: this.categorie } };
    this.router.navigate(['/tabs/home/grid'], navigationExtras);
  }

  async page_lecon(lecon) {
    if (lecon.cadena)
      return false;
    if (lecon.letter) {
      let navigationExtras: NavigationExtras = { state: { id: lecon.id, categorie: this.categorie, title: this.data.title } };
      this.router.navigate(['/tabs/home/lecon'], navigationExtras);
    } else {
      const modal = await this.modalCtrl.create({
        component: NotationPage,
        cssClass: 'my-custom-class',
        componentProps: {
          lecon: lecon,
          categorie: this.categorie
        },
      });
      await modal.present();
      await modal.onDidDismiss().then((result) => {
        this.ionViewWillEnter()
      });
    }
  }

  changeServiceOptionnel() {
    let price = this.prestation.montant;
    let delai = this.prestation.time_to_deliver;
    this.prestation.services_optionnel.forEach(element => {
      if (element.checked) {
        if (element.impact_prix) {
          if (element.impact_montant_type == 'fix')
            price = element.impact_montant_valeur;
          else
            price += element.impact_montant_valeur;
        }

        if (element.impact_delai) {
          if (element.impact_delai_type == 'fix')
            delai = element.impact_delai_valeur;
          else if (element.impact_delai_type == 'down')
            delai -= element.impact_delai_valeur;
          else
            delai += element.impact_delai_valeur;
        }
      }
    });

    this.prix = price;
    this.delai = delai;
  }

  changeService() {
    let price = null;
    let delai = null;
    let service = this.prestation.services.filter((x) => x.id == this.formGroup.controls['rubrique'].value)[0];
    this.prix = service.montant;
    this.delai = service.time_to_deliver;
  }

  async saveForm() {
    console.log(this.formGroup);
    if (this.formGroup.valid) {
      if (this.prestation.id) {
        this.reservationStorage.service_id = this.prestation.id;
        this.reservationStorage.type = 'service';
        let services_optionnel = [];
        this.prestation.services_optionnel.forEach(element => {
          if (element.checked) {
            services_optionnel.push(element.id);
          }
        });
        this.reservationStorage.services_optionnel = services_optionnel;
      } else {
        this.reservationStorage.service_id = this.formGroup.controls['rubrique'].value;
        this.reservationStorage.type = 'specific';
      }

      this.reservationStorage.reponses = this.formGroup.value;
      this.reservationStorage.message = this.message;
      this.reservationStrg.save(this.reservationStorage);
      this.router.navigate(['/tabs/panier']);
    } else {
      this.errors = [];
      Object.keys(this.formGroup.controls).forEach(key => {
        if (!this.formGroup.controls[key].valid && !this.formGroup.controls[key].disabled)
          this.errors.push(key);
      });
    }
  }

  page_reservation(prestation) {
    let prestationsMerge = this.reservationStorage.prestations
      ? _.uniqBy([...[prestation], ...this.reservationStorage.prestations], 'id')
      : [prestation];

    this.reservationStorage.prestations = prestationsMerge as [];
    this.reservationStrg.save(this.reservationStorage);
    this.router.navigate(['/tabs/home/reservation']);
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

}