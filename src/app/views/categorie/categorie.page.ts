import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { CategorieData } from '@models/business';
import { LoggerService } from '@services/utils';
import { CategorieProvider } from '@providers';
import { Watchable } from '@models/utils';
import { switchMap, tap, count } from 'rxjs/operators';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.page.html',
  styleUrls: ['./categorie.page.scss'],
})
export class CategoriePage implements OnInit {
  private readonly TAG: string = 'CategoriePage';
  private idW: Watchable<number> = new Watchable<number>();
  private categW: Watchable<CategorieData> = new Watchable<CategorieData>();

  //categW.value // katjib valeur actuel o safi
  //categW.value = categObj // kat'affecter valeur jdida
  //categW.observable.subscribe // kat'omitter a chaque valeur jdida

  data: CategorieData;
  count_prestations: any;
  count_categories: any;
  categorie: any;
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 1.5,
    spaceBetween: 25,
    speed: 400,
  };

  currentLang = window.localStorage['appLang'] ?  window.localStorage['appLang'] : 'en';
  dataText = {
    hiragana_title_desc : {
      fr: 'Choisissez le mode qui vous convient pour conquérir les hiraganas !',
      en: 'Choose the suitable learning mode and start mastering Hiragana !'
    },
    katakana_title_desc : {
      fr: 'Choisissez le mode qui vous convient pour conquérir les katakanas !',
      en: 'Choose the suitable learning mode and start mastering Katakana !'
    },
    apprend : {
      fr: 'J’apprend',
      en: 'Lessons'
    },
    apprend_desc : {
      fr: 'Découvrez le dessin de chaque',
      en: 'Discover the illustation behind each'
    },
    quiz : {
      fr: 'J’quiz',
      en: 'Quizz'
    },
    quiz_desc : {
      fr: 'Améliorez-vous avec notre J’quizz !',
      en: 'Keep improving with our fabulous Quizz'
    },
  };

  constructor(
    private logger: LoggerService,
    private categoriePrv: CategorieProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.logger.log(this.TAG, 'init');

    this.route.params.subscribe((params) => {
      this.categorie = params.id;
      if(this.categorie == 'hiragana'){
        this.data = {
          title: 'Hiragana',
          description: this.dataText.hiragana_title_desc[this.currentLang],
          image_url: 'assets/hiragana.svg',
          lecons: []
        }
      }else {
        this.data = {
          title: 'Katakana',
          description: this.dataText.katakana_title_desc[this.currentLang],
          image_url: 'assets/katakana.svg',
          lecons: []
        }
      }
    });

    /*
    this.idW.observable
      .pipe(
        tap((id) => this.logger.log(this.TAG, 'id', id)),
        switchMap((id) => this.categoriePrv.data(id)),
        tap((data) => this.logger.log(this.TAG, 'categorie data', data)),
      )
      .subscribe(
        (data) => {
          this.categW.value = data;
        },
        (err) => console.log(JSON.stringify(err)),
      );

    this.categW.observable.subscribe((data) => (this.data = data));
    */
  }

  ngOnDestroy() {
    this.logger.log(this.TAG, 'destroy');
  }

  page_categorie(categorie) {
    this.router.navigate([
      '/tabs/home/categorie',
      {
        id: categorie.id,
        count_prestations: categorie.count_prestations,
        count_categories: categorie.count_categories,
      },
    ]);
  }

  trimString(string, length) {
    return string.length > length ? 
           string.substring(0, length) + '...' :
           string;
  }

  page_prestation() {
    this.router.navigate([
      '/tabs/home/prestation',
      {
        id: this.categorie,
      },
    ]);
  }

  page_grid() {
    
    let navigationExtras: NavigationExtras = { state: { id: this.categorie, title: this.categorie } };
    this.router.navigate(['/tabs/home/grid'], navigationExtras);
  }

  page_quiz() {
    this.router.navigate([
      '/tabs/home/quiz',
      {
        id: this.categorie,
      },
    ]);
  }
}
