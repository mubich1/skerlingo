import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { HomeData } from '@models/business';
import { LoggerService } from '@services/utils';
import { HomeProvider } from '@providers';
import { IonSlides, ModalController, PopoverController } from '@ionic/angular';
import { NotationPage } from '@views/notation/notation.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { AppReservationStorage } from '@services/security';
import { ApiReservation } from '@models/security';
import { AppUserService } from '@services/api/app-user.service';
import { AvisPage } from '@views/avis/avis.page';
import { chart_Hiragana_Katana, soundOfCharacters } from '@views/prestation/static-record';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.page.html',
  styleUrls: ['grid.page.scss'],
})

export class GridPage implements OnInit, OnDestroy {
  private readonly TAG: string = 'HomePage';
  scrollDepthTriggered = false;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @ViewChild('audioPlayer') audioPlayerRef: ElementRef;
  sounds: string[] = soundOfCharacters;
  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  user: any;
  title: any;
  categorie: any;
  lecon_id: any;
  lettre_: any;
  lettre_index: any;
  data: any;
  favorites: any;
  opacity = 1;
  reservationStorage = {} as ApiReservation;
  radio: MediaObject;
  romaji: boolean;
  illustrations: boolean;
  dataText = {
    title_h4: {
      fr: 'Grid',
      en: 'Grid'
    },
  };

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
  };

  constructor(
    private logger: LoggerService,
    private homePrv: HomeProvider,
    private router: Router,
    private modalCtrl: ModalController,
    public media: Media,
    private popoverCtrl: PopoverController,
    private appUserService: AppUserService,
    private nativeAudio: NativeAudio,
    private reservationStrg: AppReservationStorage,
    private countdown: CountdownComponent,
    private route: ActivatedRoute,
  ) {

    this.user = this.appUserService.getUser();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.categorie = this.router.getCurrentNavigation().extras.state.id;
        if (this.title) {
          const tabName: string = (this.title == 'katakana') ? 'Katakana' : 'Hiragana';
          this.selectedTab(tabName, false);
        }
      }
    });

  }

  ngOnInit() {
    this.logger.log(this.TAG, 'init');
    this.reservationStorage = this.reservationStrg.load();
    this.categorie = this.categorie ? this.categorie : 'hiragana';
    this.data = chart_Hiragana_Katana.find((chartData) => {
      const slectedTab: string = this.categorie === 'hiragana' ? 'Hiragana' : 'Katakana';
      console.log('slectedTab: (ngonit)', slectedTab);
      if (chartData.title === slectedTab) {
        return chartData;
      }
    });

    this.selectedTab(this.data.title, false);
  }

  page_categorie(categorie) {
    this.router.navigate([
      '/tabs/home/categorie',
      {
        id: categorie,
      },
    ]);
  }

  page_specifique() {
    if (true) {
      let navigationExtras: NavigationExtras = { state: { demande_specifique: true } };
      this.router.navigate(['/prestation'], navigationExtras);
    }
  }


  page_prestation(prestation) {
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

  selectedTab(selectedTab: string, fetchData: boolean) {
    document.documentElement.style.setProperty("--tab-hiragana-text", selectedTab === 'Hiragana' ? "#F8830D" : "#B0B0B0");
    document.documentElement.style.setProperty("--tab-katakana-text", selectedTab === 'Katakana' ? "#F8830D" : "#B0B0B0");
    const KatakanaTab = document.getElementById('Katakana-tab');
    const HiraganaTab = document.getElementById('Hiragana-tab');
    if (selectedTab === 'Hiragana' && HiraganaTab) {
      HiraganaTab.style.borderBottom = '3px solid #F8830D';
      KatakanaTab.style.borderBottom = '1px solid #EDEDED';
    } else if (selectedTab === 'Katakana' && KatakanaTab) {
      HiraganaTab.style.borderBottom = '3px solid #EDEDED';
      KatakanaTab.style.borderBottom = '3px solid #F8830D';
    } else {
      HiraganaTab.style.borderBottom = '3px solid #EDEDED';
      KatakanaTab.style.borderBottom = '3px solid #F8830D';
    }

    this.data = chart_Hiragana_Katana.find((chartData) => chartData.title === selectedTab)
  }

  pronunciation(text: string) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  }

  playAudio(romanjiCharacter: string) {
    if(romanjiCharacter === 'w(o)'){
      romanjiCharacter = 'wo';
    }

    const audioPath = 'https://skerlingo.com/assets/mobile/sounds/' + romanjiCharacter + '.mp3';
    const audioPlayer: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audioPlayer.src = audioPath;
    // Check if the audio is paused, and if so, play it
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      // If it's already playing, pause and reset to the beginning
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  }

  ngOnDestroy() { }

}