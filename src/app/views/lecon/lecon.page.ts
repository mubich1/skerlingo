import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { CountdownComponent, CountdownConfig } from 'ngx-countdown';

import { HomeData } from '@models/business';
import { LoggerService } from '@services/utils';
import { HomeProvider } from '@providers';
import { IonSlides, ModalController, AlertController, PopoverController, Platform, IonicSafeString } from '@ionic/angular';
import { NotationPage } from '@views/notation/notation.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';


import { AppReservationStorage } from '@services/security';
import { ApiReservation } from '@models/security';
import { AppUserService } from '@services/api/app-user.service';
import { AvisPage } from '@views/avis/avis.page';
import { lessonMenuDetails, lessonsData } from '@views/prestation/static-record';
import { AdMob, BannerAdOptions } from '@capacitor-community/admob';

@Component({
  selector: 'app-lecon',
  templateUrl: 'lecon.page.html',
  styleUrls: ['lecon.page.scss'],
  //encapsulation: ViewEncapsulation.None, // added
})
export class LeconPage implements OnInit, OnDestroy {

  public subscription: any;
  public alertDismiss: any;

  currentQuestion: any;
  currentQuestionIndex: any;
  countCorrectAnswers: any = 0;
  countWrongAnswers: any = 0;
  reponseIndex: any;
  pourcentageQuiz: any = 0;
  pourcentageQuizCorrect: any = 0;
  pourcentageQuizWrong: any = 0;
  textDemarrage: any = {
    show: true,
    pause: false,
    resultat: false,
    button: 'Start the quiz'
  };
  resultatScore: any;

  timeInSeconds: any;
  remainingTime: any;
  displayTime: any;
  clockTime: any;



  private readonly TAG: string = 'HomePage';
  scrollDepthTriggered = false;

  public alertQuiz: any;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    title_h4: {
      fr: 'J\'apprends',
      en: 'Lessons'
    },
    order_trait: {
      fr: 'Ordre de trait',
      en: 'Stroke order'
    },
    feedback: {
      fr: 'Donnez votre avis sur cette carte',
      en: 'Give a comment on this card'
    },
  };

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    noSwipingClass: 'luminosite',
    speed: 400,
  };


  user: any;

  title: any;
  lecon_id: any;
  categorie: any;
  lettre_: any;
  lettre_index: any;
  data: any;
  favorites: any;
  opacity = 1;
  reservationStorage = {} as ApiReservation;

  showRomaji: false;


  radio: MediaObject;

  constructor(
    private logger: LoggerService,
    private homePrv: HomeProvider,
    private router: Router,
    private modalCtrl: ModalController,
    public media: Media,
    private popoverCtrl: PopoverController,
    private appUserService: AppUserService,
    private nativeAudio: NativeAudio,
    public alertController: AlertController,
    private reservationStrg: AppReservationStorage,
    private countdown: CountdownComponent,
    private route: ActivatedRoute,
    private platform: Platform
  ) {

    this.showInterstitialAd();
    this.user = this.appUserService.getUser();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state.id)
          this.lecon_id = this.router.getCurrentNavigation().extras.state.id;
        this.categorie = this.router.getCurrentNavigation().extras.state.categorie;

        this.title = this.router.getCurrentNavigation().extras.state.title;
      }
    });

  }

  ngOnInit() {
    this.logger.log(this.TAG, 'init');
    this.reservationStorage = this.reservationStrg.load();

    const responseData= lessonsData.find((lesson)=> lesson.lessonId == Number(this.lecon_id))
console.log('responseData: ', responseData);
this.logger.log(this.TAG, 'home data', responseData);
this.data = responseData;
if (this.data.lettres) {
  this.lettre_ = this.data.lettres[0];
}

this.slides.slideTo(0);


this.reponseIndex = null;

this.currentQuestion = this.data.questions[0];
this.currentQuestionIndex = 0;

console.log('this.currentQuestion', this.currentQuestion);

if (this.user)
  this.getFavorites();

    // this.homePrv.lecon(this.lecon_id).subscribe(
    //   async (res) => {
    //     console.log('res: $$$$ ', res);
    //     this.logger.log(this.TAG, 'home data', res);
    //     this.data = res;

    //     if (this.data.lettres) {
    //       this.lettre_ = this.data.lettres[0];
    //     }

    //     this.slides.slideTo(0);


    //     this.reponseIndex = null;

    //     this.currentQuestion = this.data.questions[0];
    //     this.currentQuestionIndex = 0;

    //     console.log('this.currentQuestion', this.currentQuestion);

    //     if (this.user)
    //       this.getFavorites();

    //   },
    //   (err) => console.log(JSON.stringify(err)),
    // );

  }

  getFavorites() {

    this.homePrv.favorites().subscribe(
      async (res) => {
        this.logger.log(this.TAG, 'home data', res);
        this.favorites = res.favorites;

      },
      (err) => console.log(JSON.stringify(err)),
    );

  }

  setFavorite() {
    this.homePrv.favorite({ lecon_id: this.lecon_id, lettre_id: this.lettre_.id }).subscribe(
      (res) => {
        this.getFavorites();
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  click_lettre(lettre, i) {
    this.lettre_index = i;
    //this.lettre_ = lettre;
    this.slides.slideTo(i);
    this.opacity = 1;
  }


  handlePanEnd(event) {

    //this.slides.lockSwipes(false);

    return false;

    if (event.deltaX < 0 && event.deltaX > -30)
      return false;

    if (event.deltaX > 0 && event.deltaX < 30)
      return false;

    let index = this.data.lettres.findIndex(x => x.id === this.lettre_.id)


    console.log('this.data.next_id', this.data.next_id);
    if (event.deltaX > 0 && this.data.lettres[index - 1])
      this.lettre_ = this.data.lettres[index - 1];
    else if (event.deltaX > 0 && this.data.prev_id) {
      this.lecon_id = this.data.prev_id;
      this.ngOnInit();
    }

    if (event.deltaX < 0 && this.data.lettres[index + 1])
      this.lettre_ = this.data.lettres[index + 1];
    else if (event.deltaX < 0 && this.data.next_id) {
      this.lecon_id = this.data.next_id;
      this.ngOnInit();
    }


  }

  async nextLesson() {
    this.showInterstitialAd();
    AdMob.showInterstitial();
    this.slides.lockSwipes(false);

    this.textDemarrage.pause = false;

    console.log('this.textDemarrage.pause', this.textDemarrage.pause);

    if (this.data.next_id) {
      this.lecon_id = this.data.next_id;
      this.ngOnInit();
    } else {
      const nextLesson: any = lessonMenuDetails.find((lesson: any) => lesson.type == this.categorie);
      if (nextLesson) {
        const lecon = nextLesson.lecons.find((lecon: any) => lecon.lessonType == "additional" && lecon.additionalCount == "1");
        console.log('lecon: ', lecon);
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
          this.router.navigate([
            '/tabs/home/prestation',
            {
              id: this.categorie,
            },
          ]);
        });
      }
    }
  }

  showInterstitialAd(){
    const options: BannerAdOptions = {
      adId:'ca-app-pub-8346175466659853/9510774848',
    }
    AdMob.prepareInterstitial(options);
  }

  ionSlidePrevEnd(event) {

    this.opacity = 1;

    let index = null;
    if (this.lettre_) {
      index = this.data.lettres.findIndex(x => x.id === this.lettre_.id)
    } else {
      index = this.data.lettres.length;
    }

    let indexSlide = this.lettre_index || this.lettre_index == 0 ? this.lettre_index : index - 1;

    if (this.data && this.data.lettres[indexSlide])
      this.lettre_ = this.data.lettres[indexSlide];
    else {
    }

    this.lettre_index = null;
  }

  async modalQuiz() {
    this.alertQuiz = await this.alertController.create({
      cssClass: 'skerlingo-alert', mode: "md",
      header: 'Are You Ready to PASS Your Test ?',
      buttons: [
        {
          text: 'Start now',
          cssClass: 'oui',
          handler: async (alertData) => {
            this.page_quiz();
          },
        },
        {
          text: 'Not now',
          role: 'cancel',
          cssClass: 'non',
          handler: (blah) => {
          },
        },
      ],
    });
    await this.alertQuiz.present();
  }

  ionSlideNextEnd(event) {

    this.opacity = 1;

    let index = this.data.lettres.findIndex(x => x.id === this.lettre_.id);


    let indexSlide = this.lettre_index || this.lettre_index == 0 ? this.lettre_index : index + 1;

    if (indexSlide == 4) {
      setTimeout(() => {
        //this.modalQuiz();
      }, 5000);
    }

    if (this.data && this.data.lettres[indexSlide])
      this.lettre_ = this.data.lettres[indexSlide];
    else {
      this.lettre_ = null;
      console.log('lockSwipes');
      this.slides.lockSwipes(true);
    }

    this.lettre_index = null;

  }

  page_quiz() {
    this.router.navigate([
      '/tabs/home/quiz',
      {
        id: this.categorie,
        lecon_id: this.lecon_id,
      },
    ]);
  }

  ionSlideReachStart(event) {
    if (this.data && this.data.prev_id) {
      this.lecon_id = this.data.prev_id;
      this.ngOnInit();
    }
  }
  ionSlideWillChange(event) {
    console.log('reach');
    console.log('event', event);
    return false;
    if (this.data && this.data.next_id) {
      this.lecon_id = this.data.next_id;
      this.ngOnInit();
    }
  }


  opacityChange($event) {
    //this.slides.lockSwipes(true);
    this.opacity = $event.detail.value;
  }

  opacityFocus($event) {
    //this.slides.lockSwipes(true);
  }

  opacityBlur($event) {
    console.log('chngedddd');
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

  click_favoris() {
    if (this.user) {
      this.setFavorite();
    } else {
      this.router.navigate(['/sliders']);
    }
  }

  checkFavoris() {
    let countFavoris = this.favorites ? this.favorites.filter((x) => x.lettre_id == this.lettre_.id) : 0;
    return (countFavoris == 0) ? 'heart-outline' : 'heart';
  }

  async avis_form(lettre) {
    const modal = await this.popoverCtrl.create({
      component: AvisPage,
      cssClass: 'auto-height small-popover avis-form my-custom-class',
      componentProps: {
        popovered: true,
        avis_infos: {
          title: lettre.label,
          color: lettre.color,
          illustration: lettre.illustration,
          illustration_letter: lettre.illustration_letter,
        }
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((result) => {
      if (result.data?.dismiss) {
      }
      if (result.data?.success) {
        //this.ionViewWillEnter();
      }
    });
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

  playLetter(audio) {

    const file: MediaObject = this.media.create(audio);

    // to listen to plugin events:

    file.onStatusUpdate.subscribe(status => console.log('status', status)); // fires when file status changes

    file.onSuccess.subscribe(() => console.log('Action is successful'));

    file.onError.subscribe(error => console.log('Error!', error));

    // play the file
    file.play();
  }

  async logScrolling($event) {
    const currentScrollDepth = $event.detail.scrollTop;
    if (currentScrollDepth > 10) this.scrollDepthTriggered = true;
    else this.scrollDepthTriggered = false;
  }


  goToNextQuestion() {
    // Go to next Question or finish quiz
    this.currentQuestionIndex++;
    this.textDemarrage.pause = false;
    this.pourcentageQuiz = (((this.currentQuestionIndex) * 100) / this.data.questions.length).toFixed(0);
    if (this.data.questions[this.currentQuestionIndex]) {

      this.reponseIndex = null;

      this.currentQuestion = this.data.questions[this.currentQuestionIndex];

      let remainingTimePrevius = this.remainingTime;
      //this.initTimer();
      /*
      if(remainingTimePrevius <= 0)
        this.timerTick();
        */
    }

  }

  async showIllustration(reponse) {
    console.log('reponse', reponse);
    let alertQuiz = await this.alertController.create({
      cssClass: 'skerlingo-alert skerlingo-alert-img', mode: "md",
      header: 'Correct answer : ' + (reponse.reponse),
      message: new IonicSafeString('<div style="background-color: ' + reponse.color + ';" class="popup-lettre-img-container" >'
        + '<img src="' + reponse?.illustration + '">'
        + '<img class="img-relative" src="' + reponse.illustration_letter + '">'
        + '</div>'),
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'non',
          handler: (blah) => {
          },
        },
      ],
    });
    await alertQuiz.present();
  }


  setQuizLettre(question, reponse) {
    console.log('reponse', reponse);
    this.homePrv.quiz_lettre({ correct: reponse.correct, lettre_id: question.lettre_id }).subscribe(
      (res) => {
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  answerQuestion(reponse, i) {

    if (this.textDemarrage.pause)
      return false;

    this.textDemarrage.pause = true;

    //Set response
    if (reponse && this.data.questions[this.currentQuestionIndex]) {

      if (reponse.correct)
        this.countCorrectAnswers++;
      else {
        let correctAnswer = this.data.questions[this.currentQuestionIndex].reponses.filter((x) => x.correct == true)[0];

        if (correctAnswer.color)
          this.showIllustration(correctAnswer);
        this.countWrongAnswers++;
      }

      this.setQuizLettre(this.data.questions[this.currentQuestionIndex], reponse);


      this.pourcentageQuizCorrect = (((this.countCorrectAnswers) * 100) / this.data.questions.length).toFixed(0);
      this.pourcentageQuizWrong = (((this.countWrongAnswers) * 100) / this.data.questions.length).toFixed(0);

      this.data.questions[this.currentQuestionIndex].answer.answer = reponse.reponse;
      this.reponseIndex = i;
    }
    if (this.data.questions[this.currentQuestionIndex])
      this.data.questions[this.currentQuestionIndex].answer.answered = this.timeInSeconds - this.remainingTime;



    if (!this.data.questions[this.currentQuestionIndex + 1])
      this.currentQuestionIndex++;


    if (!this.data.questions[this.currentQuestionIndex]) {


      window.localStorage[this.categorie + '_' + this.lecon_id] = true;

      this.displayTime = '';

      console.log('here');
      this.resultatScore = {
        can_replay: true,
        score: '10/10',
        time: '10:00',
      };

      //this.ngOnInit();

      setTimeout(() => {

        /*
        this.reponseIndex = null;

        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        */

        this.textDemarrage = {
          show: true,
          resultat: true,
          button: 'Reprendre le quiz',
          pause: false
        };

      }, 2000);

    }

  }

  async dismissForm() {
    this.alertDismiss = await this.alertController.create({
      cssClass: 'skerlingo-alert', mode: "md",
      header: 'Do you want to go back ?',
      buttons: [
        {
          text: 'Yes !',
          cssClass: 'oui',
          handler: async (alertData) => {
            this.router.navigate(['/tabs/home']);
          },
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'non',
          handler: (blah) => {
          },
        },
      ],
    });
    await this.alertDismiss.present();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      if (!this.alertDismiss && this.currentQuestion >= 0)
        this.dismissForm();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
