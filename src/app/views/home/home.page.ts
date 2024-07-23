import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { isPlatform, ModalController, NavController } from '@ionic/angular';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { HomeData } from '@models/business';
import { NotationPage } from '@views/notation/notation.page';
import { LoggerService } from '@services/utils';
import { HomeProvider } from '@providers';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  //encapsulation: ViewEncapsulation.None, // added
})
export class HomePage {
  private readonly TAG: string = 'HomePage';
  scrollDepthTriggered = false;

  data: HomeData;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.5,
    spaceBetween: 25,
    speed: 400,
  };
  slideAvisOpts = {
    initialSlide: 0,
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 400,
  };

  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    title_h3: {
      fr: 'Bienvenue sur Skerlingo !',
      en: 'Welcome to  Skerlingo !'
    },
    title_h1: {
      fr: 'Que souhaitez-vous apprendre ?',
      en: 'What do you want to learn ?'
    },
    vocab: {
      fr: 'Vocabulaire',
      en: 'Vocabulary'
    },
    vocab_proch: {
      fr: 'Prochainement',
      en: 'Soon'
    },
    par_ou: {
      fr: 'Par où commencer ?',
      en: 'Where do I start?'
    },
    par_ou_desc: {
      fr: 'Découvrez notre approche pour apprendre le japonais !',
      en: 'Discover our innovative approach to learn japanese!'
    },
  };
showAd:boolean = false
  constructor(
    private logger: LoggerService,
    private homePrv: HomeProvider,
    private router: Router,
    private modalCtrl: ModalController,
    private nav: NavController,
    private countdown: CountdownComponent,
  ) { }

  ionViewWillEnter() {
    console.log('noo');
  this.showbanner()
    this.dataText = {
      title_h3: {
        fr: 'Bienvenue sur Skerlingo !',
        en: 'Welcome to  Skerlingo !'
      },
      title_h1: {
        fr: 'Que souhaitez-vous apprendre ?',
        en: 'What do you want to learn ?'
      },
      vocab: {
        fr: 'Vocabulaire',
        en: 'Vocabulary'
      },
      vocab_proch: {
        fr: 'Prochainement',
        en: 'Soon'
      },
      par_ou: {
        fr: 'Par où commencer ?',
        en: 'Where do I start?'
      },
      par_ou_desc: {
        fr: 'Découvrez notre approche pour apprendre le japonais !',
        en: 'Discover our innovative approach to learn japanese!'
      },
    };
    this.logger.log(this.TAG, 'init');

    this.homePrv.data('list').subscribe(
      async (res) => {
        this.logger.log(this.TAG, 'home data', res);
        this.data = res;

      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  showbanner(){
    const options: BannerAdOptions = {
      adId:'ca-app-pub-8346175466659853/4241834972',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin:0,
    }
     AdMob.showBanner(options).then((res:any) =>{
        this.showAd = true
     });
  }

  removeBanner(){
    AdMob.removeBanner();
    this.showAd = false;
  }
  async page_lecon() {
    const modal = await this.modalCtrl.create({
      component: NotationPage,
      cssClass: 'my-custom-class',
      componentProps: {
        lecon: this.data.approche,
        guide: true,
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((result) => {
    });
  }

  onPageWillEnter() {
    console.log('yes');
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  page_categorie(categorie) {
    // this.router.navigate([
    //   '/tabs/home/categorie',
    //   {
    //     id: categorie,
    //   },
    // ]);
    this.router.navigate([
      '/tabs/home/prestation',
      {
        id: categorie,
      },
    ]);
  }

  parametres() {
    this.nav.navigateRoot(['/parametres']);

    //this.router.navigate(['/parametres']);

  }

  page_specifique() {
    if (true) {
      let navigationExtras: NavigationExtras = { state: { demande_specifique: true } };
      this.router.navigate(['/prestation'], navigationExtras);
    }
  }

  page_prestation(prestation) {
    this.nav.navigateRoot(['/list-item']);

    this.router.navigate([
      '/tabs/home/prestation',
      {
        id: prestation.id,
      },
    ]);
  }

  page_giveaway(giveaway) {
    this.router.navigate([
      '/tabs/home/giveaway',
      {
        id: giveaway.id,
      },
    ]);
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 10) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }

  pageGrid() {
    let navigationExtras: NavigationExtras = { state: { id: 'hiragana', title: 'hiragana' } };
    this.router.navigate(['/tabs/home/grid'], navigationExtras);
  }

}