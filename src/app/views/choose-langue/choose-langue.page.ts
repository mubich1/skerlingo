import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-choose-langue',
  templateUrl: './choose-langue.page.html',
  styleUrls: ['./choose-langue.page.scss'],
})
export class ChooseLanguePage implements OnInit {


  currentLang = window.localStorage['appLang'] ? window.localStorage['appLang'] : 'en';
  dataText = {
    title_h1: {
      fr: 'Pour continuer, veuillez choisir la langue de l’application',
      en: 'To continue, please choose the app language'
    },
    french: {
      fr: 'Français',
      en: 'French'
    },
    english: {
      fr: 'Anglais',
      en: 'English'
    },
    continuer: {
      fr: 'Continuer',
      en: 'Continue'
    },
  };

  langue: any;

  constructor(
    private nav: NavController) { }

  ngOnInit() {
  }

  choose_langue(langue) {
    this.langue = langue;
    this.currentLang = this.langue;
  }

  goTo() {
    if (this.langue) {
      window.localStorage['appLang'] = this.langue;
      this.nav.navigateRoot('/tabs/home');
    }
  }

}