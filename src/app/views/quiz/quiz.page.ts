import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, NavController, PopoverController, Platform, IonicSafeString } from '@ionic/angular';
import { HomeProvider } from '@providers';

import { Location } from "@angular/common";


import * as moment from 'moment';
import { quizzData } from '@views/prestation/static-record';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  public subscription:any;
  public alertDismiss:any;

  public reconnaissance:any;
  public quizContent:any;

  public today:any = moment().format('DD/MM/YYYY');

  eleve:any;
  _result: any;
  currentQuestion: any;
  currentQuestionIndex: any;
  countCorrectAnswers: any = 0;
  countWrongAnswers: any = 0;
  reponseIndex: any;
  pourcentageQuiz: any = 0;
  pourcentageQuizCorrect: any = 0;
  pourcentageQuizWrong: any = 0;
  textDemarrage: any = {
    show : true,
    pause : false,
    resultat : false,
    button : 'Start the quiz'
  };
  resultatScore: any;

  timeInSeconds:any;
  remainingTime:any;
  displayTime:any;
  clockTime : any;


  categorie: any;
  lecon_id: any;


  constructor(
    public alertController: AlertController,
    private homePrv: HomeProvider,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public loadingCtrl: LoadingController,
    private location: Location,
    private platform: Platform) { }


  ngOnInit() {

      this.route.params.subscribe((params) => {
        this.categorie = params.id;
        if(params.lecon_id)
          this.lecon_id = params.lecon_id;
      });

      if(this.lecon_id){
        console.log('start quiz');
        this.getQuestions();
      }
  }


  getQuestions() {
    if (!this.lecon_id) {
      this._result = quizzData.find((quizz: any) => {
        if (quizz.quizContent == this.quizContent && quizz.categorie == this.categorie) {
          return quizz;
        }
      }
      )
    }
    else{
      this.homePrv.quiz(this.categorie, this.quizContent, this.lecon_id).subscribe(
        async (res) => {
          this._result = res;

          console.log('this._result', this._result);

          if(this.lecon_id){
            this.startQuiz(false, null);
          }
        },
        (err) => console.log(JSON.stringify(err)),
      );
    }
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      if(!this.alertDismiss && this.currentQuestion)
        this.dismissForm();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async dismissForm() {
    this.alertDismiss = await this.alertController.create({
      cssClass: 'skerlingo-alert', mode: "md",
      header:  'Are you sure want to quit ?',
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

  goToNextQuestion() {
    // Go to next Question or finish quiz
      this.currentQuestionIndex++;
      this.textDemarrage.pause = false;
      this.pourcentageQuiz = (((this.currentQuestionIndex) * 100) / this._result.questions.length).toFixed(0);
      if(this._result.questions[this.currentQuestionIndex]){

        this.reponseIndex = null;

        this.currentQuestion = this._result.questions[this.currentQuestionIndex];

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
      header:  'Correct answer : ' + (this.reconnaissance ? reponse.kana : reponse.reponse),
      message: new IonicSafeString('<div style="background-color: '+reponse.color+';" class="popup-lettre-img-container" >'
                 + '<img src="' + reponse?.illustration + '">'
                 + '<img class="img-relative" src="'+reponse.illustration_letter+'">'
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
    this.homePrv.quiz_lettre({ correct : reponse.correct, lettre_id: question.lettre_id}).subscribe(
      (res) => {
      },
      (err) => console.log(JSON.stringify(err)),
    );
  }

  answerQuestion(reponse, i) {

    if(this.textDemarrage.pause)
      return false;

    this.textDemarrage.pause = true;

    //Set response
    if(reponse && this._result.questions[this.currentQuestionIndex]) {


      if(reponse.correct)
        this.countCorrectAnswers++;
      else{
        let correctAnswer = this._result.questions[this.currentQuestionIndex].reponses.filter((x) => x.correct == true )[0];

        if(correctAnswer.color)
          this.showIllustration(correctAnswer);
        this.countWrongAnswers++;
      }


      this.setQuizLettre(this._result.questions[this.currentQuestionIndex], reponse);

        this.pourcentageQuizCorrect = (((this.countCorrectAnswers) * 100) / this._result.questions.length).toFixed(0);
        this.pourcentageQuizWrong = (((this.countWrongAnswers) * 100) / this._result.questions.length).toFixed(0);

      this._result.questions[this.currentQuestionIndex].answer.answer = reponse.reponse;
      this.reponseIndex = i;
    }
    if(this._result.questions[this.currentQuestionIndex])
      this._result.questions[this.currentQuestionIndex].answer.answered = this.timeInSeconds - this.remainingTime;



    if(!this._result.questions[this.currentQuestionIndex + 1])
      this.currentQuestionIndex++;


    if(!this._result.questions[this.currentQuestionIndex]) {

      this.displayTime = '';

      console.log('here');
      this.resultatScore = {
        can_replay: true,
        score : '10/10',
        time : '10:00',
      };

      //this.ngOnInit();

      setTimeout(() => {

        this.reponseIndex = null;

        this.currentQuestion = null;
        this.currentQuestionIndex = 0;

        this.textDemarrage = {
          show : true,
          resultat : true,
          button : 'Reprendre le quiz',
          pause: true
        };

      }, 2000);

    }

  }


  initTimer() {
   this.timeInSeconds = this.currentQuestion.temps_reponse;
   this.remainingTime = this.currentQuestion.temps_reponse;
   this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
 }

 startTimer() {
   this.timerTick();
 }

 timerTick() {

  this.clockTime = setTimeout(() => {

    if(this.remainingTime > 0)
      this.remainingTime--;
     this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
     if (this.remainingTime > 0) {
       this.timerTick();
     }
     else {
       this.answerQuestion(null, null)
     }
   }, 1000);
 }

 getSecondsAsDigitalClock(inputSeconds: number) {
   var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
   var minutes = Math.floor((sec_num) / 60);
   var seconds = sec_num  - (minutes * 60);
   var minutesString = '';
   var secondsString = '';
   minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
   secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
   return minutesString + ':' + secondsString;
 }

 closeQuiz(){

  if(this.lecon_id){
    window.localStorage[this.categorie+'_'+this.lecon_id] = true;
    this.location.back();
  }
  else {
    this.router.navigate(['/tabs/home']);
  }
 }

  tryAgain(){
    this.quizContent = null;
    this.currentQuestion = null;
    this.textDemarrage.resultat = null;
    this.resultatScore = null
  }

  startQuiz(reconnaissance = null, content = null) {
    if(content){

      this.quizContent = content;
      console.log('  this.quizContent: ',   this.quizContent);
      this.getQuestions();
      return false;
    }

    this.reconnaissance = reconnaissance;

    this.countCorrectAnswers = 0;
    this.countWrongAnswers = 0;

    if(this._result && this._result.questions){
      this.currentQuestion = this._result.questions[0];
      this.currentQuestionIndex = 0;
    }
    clearTimeout(this.clockTime);
    //this.initTimer();
    //this. startTimer();

    this.pourcentageQuiz = 0;
    this.textDemarrage.show = false;
    this.textDemarrage.pause = false;
    this.textDemarrage.resultat = false;
  }

  page_grid() {
    let navigationExtras: NavigationExtras = { state: { id: this.categorie, title: this.categorie } };
    this.router.navigate(['/tabs/home/grid'], navigationExtras);
  }

}
